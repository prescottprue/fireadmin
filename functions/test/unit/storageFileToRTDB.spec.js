import * as admin from 'firebase-admin' // eslint-disable-line no-unused-vars

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
    process.env.FIREBASE_CONFIG = JSON.stringify({
      databaseURL: 'https://some-project.firebaseio.com',
      storageBucket: 'some-bucket.appspot.com'
    })
    functionsTest.mockConfig({
      firebase: {
        databaseURL: 'https://some-project.firebaseio.com'
      },
      encryption: {},
      algolia: {},
      email: {}
    })
    adminInitStub = sinon.stub(admin, 'initializeApp')
    databaseStub = sinon.stub()
    firestoreStub = sinon.stub()
    refStub = sinon.stub()
    setStub = sinon.stub()
    docStub = sinon.stub()
    docSetStub = sinon.stub()
    refStub.returns({ root: setStub })
    setStub.returns(Promise.resolve({ ref: 'new_ref' }))
    databaseStub.ServerValue = { TIMESTAMP: 'test' }
    databaseStub.returns({ ref: refStub })
    docStub.returns({ set: docSetStub })
    firestoreStub.returns({ doc: docStub })
    sinon.stub(admin, 'database').get(() => databaseStub)
    // sinon.stub(gcs).returns(new MockStorage())
    // Stub Firebase's functions.config()
    storageFileToRTDB = functionsTest.wrap(
      require(`${__dirname}/../../index`).storageFileToRTDB
    )
  })

  afterEach(() => {
    functionsTest.cleanup()
    adminInitStub.restore()
  })

  describe('Storage File to RTDB', () => {
    // TODO: UNSKIP
    // Currently skipped due to:
    // TypeError: Attempted to wrap undefined property undefined as function
    it.skip('responds to fake event', async () => {
      const snap = {
        val: () => ({ displayName: 'some', filePath: 'some' })
      }
      const fakeContext = {
        params: { filePath: 'testing', userId: 1 }
      }
      // Invoke webhook with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      await storageFileToRTDB(snap, fakeContext)
    })
  })
})
