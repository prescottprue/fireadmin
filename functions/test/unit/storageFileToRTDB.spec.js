import * as admin from 'firebase-admin' // eslint-disable-line no-unused-vars
import fauxJax from 'faux-jax'
import { to } from 'utils/async'

describe('storageFileToRTDB RTDB Cloud Function (database:onCreate)', () => {
  let storageFileToRTDB
  let adminInitStub
  let refStub
  let docStub
  let docSetStub
  let setStub
  let databaseStub
  let firestoreStub

  beforeEach(() => {
    // Stub Firebase's functions.config() (default in test/setup)
    mockFunctionsConfig()
    // Stub Firebase's admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Stub Real Time Database and Firestore
    databaseStub = sinon.stub()
    firestoreStub = sinon.stub()
    refStub = sinon.stub()
    setStub = sinon.stub()
    docStub = sinon.stub()
    docSetStub = sinon.stub()
    refStub.returns({ root: setStub })
    setStub.returns(Promise.resolve({ ref: {} }))
    databaseStub.ServerValue = { TIMESTAMP: 'test' }
    databaseStub.returns({ ref: refStub })
    docStub.returns({ set: docSetStub })
    firestoreStub.returns({ doc: docStub })
    sinon.stub(admin, 'database').get(() => databaseStub)
    // Intercept all http requests and respond with 200
    fauxJax.install()
    fauxJax.on('request', function respond(request) {
      request.respond(200, {}, '{}')
    })
    // Start of storage mock
    // sinon.stub(gcs).returns(new MockStorage())
    // Stub Firebase's functions.config()
    storageFileToRTDB = functionsTest.wrap(
      require(`${__dirname}/../../index`).storageFileToRTDB
    )
    // Stub Firebase's config environment var
    process.env.FIREBASE_CONFIG = JSON.stringify({
      databaseURL: 'https://some-project.firebaseio.com',
      storageBucket: 'some-bucket.appspot.com'
    })
  })

  afterEach(() => {
    functionsTest.cleanup()
    adminInitStub.restore()
    // Restore http request functionality
    fauxJax.restore()
  })

  describe('Storage File to RTDB', () => {
    // TODO: UNSKIP
    // Currently skipped due to:
    // Error: Could not refresh access token.
    it('responds to fake event', async () => {
      const snap = {
        val: () => ({ displayName: 'some', filePath: 'some' })
      }
      const fakeContext = {
        params: { filePath: 'testing', userId: 1 }
      }
      // Invoke webhook with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      const [err] = await to(storageFileToRTDB(snap, fakeContext))
      expect(err).to.have.property('message', 'Could not refresh access token.')
    })
  })
})
