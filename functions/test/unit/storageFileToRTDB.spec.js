import * as admin from 'firebase-admin' // eslint-disable-line no-unused-vars
import fauxJax from 'faux-jax'
import { to } from 'utils/async'
import fs from 'fs'

describe('storageFileToRTDB RTDB Cloud Function (database:onCreate)', () => {
  let storageFileToRTDB
  let adminInitStub
  let refStub
  let docStub
  let docSetStub
  let setStub
  let databaseStub
  let firestoreStub
  let storageAdminStub
  let fakeContext

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

    const storageStub = sinon.stub().returns({
      bucket: sinon.stub().returns({
        file: sinon.stub().returns({
          delete: sinon.stub().returns(Promise.resolve({})),
          // Mock download method with invalid JSON file data
          download: sinon.spy(({ destination }) => {
            fs.writeFileSync(
              destination,
              JSON.stringify({ asdf: 'asdf' }, null, 2)
            )
            return Promise.resolve({ asdf: 'asdf' })
          })
        })
      })
    })
    storageAdminStub = sinon.stub(admin, 'storage').get(() => storageStub)
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
    fakeContext = {
      params: { projectId: 'asdf', environmentId: 'asdf' }
    }
  })

  afterEach(() => {
    functionsTest.cleanup()
    adminInitStub.restore()
    // Restore http request functionality
    fauxJax.restore()
    storageAdminStub.restore()
  })

  describe('Storage File to RTDB', () => {
    it('throws for a missing filePath', async () => {
      const snap = {
        val: () => ({ databasePath: 'some' })
      }
      // Invoke webhook with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      const [err] = await to(storageFileToRTDB(snap, fakeContext))
      expect(err).to.have.property(
        'message',
        `"filePath" and "databasePath" are required to copy file to RTDB`
      )
    })

    it('throws for a missing databasePath', async () => {
      const snap = {
        val: () => ({ filePath: 'some' })
      }
      // Invoke webhook with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      const [err] = await to(storageFileToRTDB(snap, fakeContext))
      expect(err).to.have.property(
        'message',
        `"filePath" and "databasePath" are required to copy file to RTDB`
      )
    })

    it('resolves with filePath after completing successfully', async () => {
      const filePath = 'someFilePath'
      const databasePath = 'someDbPath'
      const snap = {
        val: () => ({ filePath, databasePath }),
        ref: {
          root: {
            child: sinon.stub().returns({
              set: sinon.stub().returns(Promise.resolve())
            })
          }
        }
      }
      // Invoke cloud function with fake data
      const res = await storageFileToRTDB(snap, fakeContext)
      expect(res).to.equal(filePath)
    })
  })
})
