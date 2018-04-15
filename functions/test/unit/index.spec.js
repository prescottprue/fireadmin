describe('Cloud Functions', () => {
  let storageFileToRTDB
  let adminInitStub
  let functions
  let admin

  before(() => {
    admin = require('firebase-admin')
    adminInitStub = sinon.stub(admin, 'initializeApp')
    storageFileToRTDB = functionsTest.wrap(
      require(`${__dirname}/../../index`).storageFileToRTDB
    )
  })

  after(() => {
    adminInitStub.restore()
  })

  describe('Storage File to RTDB', () => {
    it('responds to fake event', done => {
      const fakeEvent = {
        // The DeltaSnapshot constructor is used by the Functions SDK to transform a raw event from
        // your database into an object with utility functions such as .val().
        // Its signature is: DeltaSnapshot(app: firebase.app.App, adminApp: firebase.app.App,
        // data: any, delta: any, path?: string);
        // We can pass null for the first 2 parameters. The data parameter represents the state of
        // the database item before the event, while the delta parameter represents the change that
        // occured to cause the event to fire. The last parameter is the database path, which we are
        // not making use of in this test. So we will omit it.
        data: new functions.database.DeltaSnapshot(
          adminInitStub,
          adminInitStub,
          null,
          { filePath: 'testing' },
          'requests/fileToDb/123ABC'
        )
        // To mock a database delete event:
        // data: new functions.database.DeltaSnapshot(null, null, 'old_data', null)
      }
      // Invoke webhook with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      storageFileToRTDB(fakeEvent)
    })
  })
})
