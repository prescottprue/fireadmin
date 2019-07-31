describe.skip('api HTTPS Cloud Function', () => {
  let apiFunction
  let configStub
  let adminInitStub
  let functions
  let admin

  before(() => {
    // Stub Firebase's admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp')
    configStub = sinon.stub(functions, 'config').returns({
      firebase: {
        databaseURL: 'https://not-a-project.firebaseio.com',
        storageBucket: 'not-a-project.appspot.com',
        projectId: 'not-a-project.appspot',
        messagingSenderId: '823357791673'
      }
      // Stub any other config values needed by your functions here
    })
    apiFunction = require(`../../src/api`).default
    /* eslint-enable global-require */
  })

  after(() => {
    // Restoring our stubs to the original methods.
    configStub.restore()
    adminInitStub.restore()
  })

  it('responds with hello message when sent an empty request', done => {
    const req = {}
    // Parameters of request can also be stubbed
    // const req = { query: { text: 'input' } }
    // A fake response object, with a stubbed end function which asserts that
    // it is called with a hello message
    const res = {
      end: msg => {
        expect(msg).to.equal('Hello from api!')
        done()
      }
    }
    // Invoke https function with fake request + response objects
    apiFunction(req, res)
  })
})
