/* eslint-disable global-require */
// Chai is a commonly used library for creating unit test suites. It is easily extended with plugins.
const chai = require('chai')
// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon')
const assert = chai.assert
// const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

describe('Cloud Functions', () => {
  let myFunctions
  let configStub
  let adminInitStub
  let functions
  let admin
  let databaseStub
  let req
  let res
  before(() => {
    // Since index.js makes calls to functions.config and admin.initializeApp at the top of the file,
    // we need to stub both of these functions before requiring index.js. This is because the
    // functions will be executed as a part of the require process.
    // Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
    admin = require('firebase-admin')
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Next we stub functions.config(). Normally config values are loaded from Cloud Runtime Config;
    // here we'll just provide some fake values for firebase.databaseURL and firebase.storageBucket
    // so that an error is not thrown during admin.initializeApp's parameter check
    functions = require('firebase-functions')
    configStub = sinon.stub(functions, 'config').returns({
      firebase: {
        databaseURL: 'https://not-a-project.firebaseio.com',
        storageBucket: 'not-a-project.appspot.com'
      },
      asana: {
        token: 'test'
      }
      // You can stub any other config values needed by your functions here, for example:
      // foo: 'bar'
    })
    // Now we can require index.js and save the exports inside a namespace called myFunctions.
    // This includes our cloud functions, which can now be accessed at myFunctions.asanaWebhook

    // if we use ../ without dirname here, it can not be run with --prefix from parent folder
    myFunctions = require(`${__dirname}/../index.es7`)
  })

  after(() => {
    // Restoring our stubs to the original methods.
    configStub.restore()
    adminInitStub.restore()
  })

  describe('HTTP Function', () => {
    beforeEach(() => {
      // [START stubAdminDatabase]
      const refParam = '/messages'
      const pushParam = { original: 'input' }
      const refStub = sinon.stub()
      const pushStub = sinon.stub()

      // The following 4 lines override the behavior of admin.database().ref('/messages')
      // .push({ original: 'input' }) to return a promise that resolves with { ref: 'new_ref' }.
      // This mimics the behavior of a push to the database, which returns an object containing a
      // ref property representing the URL of the newly pushed item.
      databaseStub = sinon.stub(admin, 'database')
      databaseStub.returns({ ref: refStub })
      refStub.withArgs(refParam).returns({ push: pushStub })
      pushStub.withArgs(pushParam).returns(Promise.resolve({ ref: 'new_ref' }))
    })

    afterEach(() => {
      // Restoring admin.database() to the original method
      databaseStub.restore()
    })

    it('responds with active message if there are no events', done => {
      // A fake request object, with req.query.text set to 'input'
      req = { headers: {} }
      // A fake response object, with a stubbed writeHead and end methods
      res = {
        writeHead: () => {},
        end: str => {
          assert.equal(str, 'Webhook is running!')
          done()
        }
      }
      // Invoke webhook with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      myFunctions.docusignWebhook(req, res)
    })

    it('resolves when passed events', done => {
      // A fake request object, with req.query.text set to 'input'
      req = { headers: {}, body: { events: [{}] } }
      // TODO: Stub internal functions and make sure they are called
      // A fake response object, with a stubbed writeHead and end methods
      res = {
        writeHead: () => {},
        end: str => {
          assert.equal(str, 'Webhook is running!')
          done()
        }
      }
      // Invoke webhook with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      myFunctions.docusignWebhook(req, res)
    })

    it.skip('throws for error case', done => {
      // A fake request object, with req.query.text set to 'input'
      req = { headers: {}, body: { events: [{}] } }
      // TODO: Stub internal functions and make sure they are called
      // A fake response object, with a stubbed writeHead and end methods
      res = {
        writeHead: () => {},
        end: str => {
          assert.equal(str, 'Thanks anyway :)')
          done()
        }
      }
      // Invoke webhook with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      // expect(myFunctions.docusignWebhook(req, res)).to.Throw('some error')
    })
  })
})
