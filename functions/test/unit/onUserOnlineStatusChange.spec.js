describe('onUserOnlineStatusChange RTDB Cloud Function (RTDB:onUpdate)', () => {
  let onUserOnlineStatusChange
  let adminInitStub
  let admin

  before(() => {
    /* eslint-disable global-require */
    admin = require('firebase-admin')
    // Stub Firebase's admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Stub Firebase's functions.config()
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
    const snap = {
      val: () => ({ displayName: 'some', filePath: 'some' })
    }
    const fakeContext = {
      params: { filePath: 'testing', userId: 1 }
    }
    // Invoke with fake event object
    const result = await onUserOnlineStatusChange(
      { before: snap, after: snap },
      fakeContext
    )
    expect(result).to.exist
  })
})
