describe.skip('onUserOnlineStatusChange RTDB Cloud Function (RTDB:onUpdate)', () => {
  let onUserOnlineStatusChange
  let adminInitStub
  let admin
  let functions
  let configStub

  before(() => {
    /* eslint-disable global-require */
    admin = require('firebase-admin')
    // Stub Firebase's admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp')
    functions = require('firebase-functions')
    configStub = sinon.stub(functions, 'config').returns({
      firebase: {
        databaseURL: 'https://not-a-project.firebaseio.com',
        storageBucket: 'not-a-project.appspot.com',
        projectId: 'not-a-project.appspot',
        messagingSenderId: '823357791673'
      },
      algolia: {
        app_id: 'asdf',
        api_key: 'asdf'
      },
      gmail: {},
      encryption: {
        password: 'asdf'
      },
      service_account: {}
      // You can stub any other config values needed by your functions here, for example:
      // foo: 'bar'
    })
    // Stub Firebase's functions.config()
    onUserOnlineStatusChange = functionsTest.wrap(
      require(`${__dirname}/../../index`).onUserOnlineStatusChange
    )
    /* eslint-enable global-require */
  })

  after(() => {
    // Restoring our stubs to the original methods.
    configStub.restore()
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
