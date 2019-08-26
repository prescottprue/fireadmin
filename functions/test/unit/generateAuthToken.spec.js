import { to } from 'utils/async'

describe('generateAuthToken HTTPS Callable Cloud Function', () => {
  let generateAuthToken
  let configStub
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
    configStub = sinon.stub(functions, 'config').returns({
      firebase: {
        databaseURL: 'https://not-a-project.firebaseio.com',
        storageBucket: 'not-a-project.appspot.com',
        projectId: 'not-a-project.appspot',
        messagingSenderId: '823357791673'
      }
      // Stub any other config values needed by your functions here
    })
    generateAuthToken = require(`./index`).generateAuthTokenRequest
    /* eslint-enable global-require */
  })

  after(() => {
    // Restoring our stubs to the original methods.
    configStub.restore()
    adminInitStub.restore()
  })

  it('responds with hello message when sent an empty request', async () => {
    const data = {}
    const context = {}
    // Invoke request handler with fake data + context objects
    const [err, response] = await to(generateAuthToken(data, context))
    // Confirm no error is thrown
    expect(err).to.not.exist
    // Confirm response contains message
    expect(response).to.have.property('message', 'Hello World')
  })
})
