describe('Cloud Functions', () => {
  let storageFileToRTDB
  let adminInitStub
  let admin

  before(() => {
    admin = require('firebase-admin')
    adminInitStub = sinon.stub(admin, 'initializeApp')
    storageFileToRTDB = functionsTest.wrap(
      require(`${__dirname}/../../index`).storageFileToRTDB
    )
  })

  after(() => {
    functionsTest.cleanup()
    adminInitStub.restore()
  })

  describe('Storage File to RTDB', () => {
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
