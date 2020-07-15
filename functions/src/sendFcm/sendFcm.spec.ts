import { expect } from 'chai';
import * as admin from 'firebase-admin'
import functionsTestLib from 'firebase-functions-test'
import sinon from 'sinon';
import { to } from '../utils/async'

const functionsTest = functionsTestLib()
// console.log('asdfasdf', require(`${__dirname}/../../index`))
const userId = 1
const refParam = `users_public/${userId}`

describe('sendFcm RTDB Cloud Function (onCreate)', () => {
  let adminInitStub
  let sendFcm

  before(() => {
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Set GCLOUD_PROJECT to env
    process.env.GCLOUD_PROJECT = 'test'
    // Stub Firebase's config environment var
    process.env.FIREBASE_CONFIG = JSON.stringify({
      databaseURL: 'https://some-project.firebaseio.com',
      storageBucket: 'some-bucket.appspot.com'
    })
    /* eslint-disable global-require */
    sendFcm = functionsTest.wrap(require(`${__dirname}/../../src/sendFcm`).default)
    /* eslint-enable global-require */
  })

  after(() => {
    adminInitStub.restore()
    functionsTest.cleanup()
  })

  it('throws if userId is not provided', async () => {
    const databaseStub = sinon.stub()
    const refStub = sinon.stub()
    const removeStub = sinon.stub()

    refStub.withArgs(refParam).returns({ remove: removeStub })
    removeStub.returns(Promise.resolve({ ref: 'new_ref' }))
    databaseStub.returns({ ref: refStub })
    sinon.stub(admin, 'database').get(() => databaseStub)
    const snap = {
      val: () => null
    }
    const fakeContext = {
      params: { filePath: 'testing', userId: 1 }
    }

    const [err] = await to(sendFcm(snap, fakeContext))
    expect(err).to.have.property(
      'message',
      'userId is required to send FCM message'
    )
  })

  it('throws if user profile does not contain messaging id', async () => {
    const userId = 'asdf'
    const refStub = sinon.stub().returns({})
    const databaseStub = sinon.stub().returns({ ref: refStub })
    const getStub = sinon.stub().returns(
      Promise.resolve({
        get: sinon.stub().returns(undefined)
      })
    )
    const docStub = sinon.stub().returns({ get: getStub })
    const collectionStub = sinon.stub().returns({ doc: docStub })
    // Apply stubs as admin.firestore()
    const firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })
    sinon.stub(admin, 'firestore').get(() => firestoreStub)
    sinon.stub(admin, 'database').get(() => databaseStub)
    const snap = {
      val: () => ({ userId })
    }
    const fakeContext = {
      params: { filePath: 'testing', userId: 1 }
    }
    const result = await sendFcm(snap, fakeContext)
    expect(result).to.be.null
  })
})
