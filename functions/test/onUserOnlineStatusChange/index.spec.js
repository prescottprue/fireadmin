describe('onUserOnlineStatusChange RTDB Cloud Function (RTDB:onUpdate)', () => {
  let onUserOnlineStatusChange
  let adminInitStub
  let functions
  let admin

  before(() => {
    /* eslint-disable global-require */
    admin = require('firebase-admin')
    // Stub Firebase's admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Stub Firebase's functions.config()
    functions = require('firebase-functions')
    onUserOnlineStatusChange = functionsTest.wrap(
      require(`${__dirname}/../../index`).onUserOnlineStatusChange
    )
    /* eslint-enable global-require */
  })

  after(() => {
    // Restoring our stubs to the original methods.
    adminInitStub.restore()
  })

  it('invokes successfully', async () => {
    const fakeEvent = {
      data: new functions.database.DeltaSnapshot(
        adminInitStub,
        adminInitStub,
        null,
        { some: 'thing' }, // data object
        'requests/fileToDb/123ABC'
      )
    }
    // Invoke with fake event object
    const result = await onUserOnlineStatusChange(fakeEvent)
    expect(result).to.exist
  })
})
