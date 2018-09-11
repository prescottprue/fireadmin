import * as admin from 'firebase-admin'
import nodemailer from 'nodemailer'
import { to } from 'utils/async'

describe('sendInvite RTDB Cloud Function (onCreate)', () => {
  let adminInitStub
  let sendInvite
  let updateStub
  let deleteStub
  let docStub
  let collectionStub

  beforeEach(() => {
    updateStub = sinon.stub().returns(Promise.resolve({}))
    deleteStub = sinon.stub().returns(Promise.resolve({}))
    docStub = sinon.stub().returns({ update: updateStub, delete: deleteStub })
    collectionStub = sinon
      .stub()
      .returns({ add: sinon.stub().returns(Promise.resolve({})), doc: docStub })
    // Apply stubs as admin.firestore()
    const firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })
    sinon.stub(admin, 'firestore').get(() => firestoreStub)
    sinon
      .stub(nodemailer, 'createTransport')
      .returns({ sendMail: () => Promise.resolve({}) })
    // sinon.stub(nodemailer, 'sendMail').returns(Promise.resolve({}))
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Stub Firebase's config environment var
    process.env.FIREBASE_CONFIG = JSON.stringify({
      databaseURL: 'https://some-project.firebaseio.com',
      storageBucket: 'some-bucket.appspot.com'
    })
    // Set GCLOUD_PROJECT to env
    process.env.GCLOUD_PROJECT = 'test'
    mockFunctionsConfig({ gmail: { email: 'test', password: 'test' } })
    /* eslint-disable global-require */
    sendInvite = functionsTest.wrap(
      require(`${__dirname}/../../index`).sendInvite
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
    adminInitStub.restore()
    functionsTest.cleanup()
    nodemailer.createTransport.restore()
    process.env.GCLOUD_PROJECT = undefined
  })

  it('throws if email is not included in request', async () => {
    const [err] = await to(sendInvite({ val: () => ({}) }))
    expect(err).to.have.property(
      'message',
      'email and projectName parameters are required to send email'
    )
  })

  it('throws if projectName is not included in request', async () => {
    const [err] = await to(sendInvite({ val: () => ({ email: 'test' }) }))
    expect(err).to.have.property(
      'message',
      'email and projectName parameters are required to send email'
    )
  })

  it('throws if valid mail transport is not created', async () => {
    nodemailer.createTransport.restore()
    sinon.stub(nodemailer, 'createTransport').returns(null)
    const [err] = await to(sendInvite({ val: () => ({ email: 'test' }) }))
    expect(err).to.have.property(
      'message',
      'Gmail Email not set. Email can not be sent.'
    )
  })

  it('sends email message and returns email if provided a valid request', async () => {
    const fakeEmail = 'test'
    const [err, result] = await to(
      sendInvite({ val: () => ({ email: fakeEmail, projectName: 'test' }) })
    )
    expect(err).to.be.null
    expect(result).to.equal(fakeEmail)
  })

  it('throws if message is not sent successfully', async () => {
    const fakeEmail = 'test'
    const fakeErr = new Error('asdf')
    nodemailer.createTransport.restore()
    sinon
      .stub(nodemailer, 'createTransport')
      .returns({ sendMail: () => Promise.reject(fakeErr) })
    const [err] = await to(
      sendInvite({ val: () => ({ email: fakeEmail, projectName: 'test' }) })
    )
    expect(err).to.equal(fakeErr)
  })
})
