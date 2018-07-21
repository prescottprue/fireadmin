describe.skip('storageFileToRTDB Cloud Function', () => {
  let storageFileToRTDB
  let adminInitStub
  let admin
  let gcs
  let mockBucket

  before(() => {
    admin = require('firebase-admin')
    gcs = require('@google-cloud/storage')()
    adminInitStub = sinon.stub(admin, 'initializeApp')
    mockBucket = sinon.stub(gcs, 'bucket').callsFake(() => ({}))
    storageFileToRTDB = functionsTest.wrap(
      require(`${__dirname}/../../index`).storageFileToRTDB
    )
  })

  after(() => {
    functionsTest.cleanup()
    adminInitStub.restore()
    mockBucket.restore()
  })

  describe('Converts Storage File to RTDB', () => {
    it('responds to fake event', async () => {
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
