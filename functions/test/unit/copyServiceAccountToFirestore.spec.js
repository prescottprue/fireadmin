import * as admin from 'firebase-admin'
import { to } from 'utils/async'

describe('copyServiceAccountToFirestore Firestore Cloud Function (onCreate)', () => {
  let copyServiceAccountToFirestore
  let refStub // eslint-disable-line no-unused-vars
  let docSetStub // eslint-disable-line no-unused-vars
  let adminInitStub
  let getStub
  let setStub
  let docStub
  let collectionStub
  let databaseStub

  beforeEach(() => {
    // Stub Firebase's functions.config() (default in test/setup)
    mockFunctionsConfig()
    setStub = sinon.stub().returns(Promise.resolve({}))
    getStub = sinon.stub().returns(Promise.resolve({}))
    refStub = sinon.stub().returns({ set: setStub })
    docStub = sinon.stub().returns({
      set: setStub,
      get: getStub,
      collection: sinon.stub().returns({
        add: sinon.stub().returns(Promise.resolve({})),
        doc: docStub
      })
    })
    collectionStub = sinon
      .stub()
      .returns({ add: sinon.stub().returns(Promise.resolve({})), doc: docStub })
    databaseStub = sinon.stub()
    // Stub Firebase's admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp')
    refStub = sinon.stub()
    setStub = sinon.stub()
    refStub.returns({ set: setStub, update: setStub })
    setStub.returns(Promise.resolve({ ref: 'new_ref' }))
    databaseStub.ServerValue = { TIMESTAMP: 'test' }
    databaseStub.returns({ ref: refStub })
    sinon.stub(admin, 'database').get(() => databaseStub)
    // Apply stubs as admin.firestore()
    const firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })
    sinon.stub(admin, 'firestore').get(() => firestoreStub)
    const createdAt = 'timestamp'
    admin.firestore.FieldValue = { serverTimestamp: () => createdAt }
    // Set GCLOUD_PROJECT to env
    process.env.GCLOUD_PROJECT = 'test'
    // Stub Firebase's config environment var
    process.env.FIREBASE_CONFIG = JSON.stringify({
      databaseURL: 'https://some-project.firebaseio.com',
      storageBucket: 'some-bucket.appspot.com'
    })
    /* eslint-disable global-require */
    copyServiceAccountToFirestore = functionsTest.wrap(
      require(`${__dirname}/../../index`).copyServiceAccountToFirestore
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
    adminInitStub.restore()
    // Restoring stubs to the original methods
    functionsTest.cleanup()
  })

  it('throws if service account paramter is not provided', async () => {
    const fakeEvent = {
      data: () => ({})
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(
      copyServiceAccountToFirestore(fakeEvent, fakeContext)
    )
    expect(err).to.have.property(
      'message',
      'serviceAccount parameter is required to copy service account to Firestore'
    )
  })

  it('throws for non-existant service account path', async () => {
    const fakeEventData = { serviceAccount: { test: 'asdf' } }
    const fakeEvent = {
      data: () => fakeEventData
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(
      copyServiceAccountToFirestore(fakeEvent, fakeContext)
    )
    expect(err).to.have.property('message', 'A file name must be specified.')
  })

  it('throws for service account path that points to non existing file', async () => {
    const fakeEventData = { serviceAccount: { fullPath: 'test' } }
    const fakeEvent = {
      data: () => fakeEventData
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(
      copyServiceAccountToFirestore(fakeEvent, fakeContext)
    )
    expect(err).to.have.property('message', 'Not Found')
  })
})
