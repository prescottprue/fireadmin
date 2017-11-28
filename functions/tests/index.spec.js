/* eslint-disable global-require */
// Chai is a commonly used library for creating unit test suites. It is easily extended with plugins.
const chai = require('chai')
// Sinon is a library used for mocking or verifying function calls in JavaScript.
const sinon = require('sinon')
const assert = chai.assert
// const expect = chai.expect
// const chaiAsPromised = require('chai-as-promised')
// chai.use(chaiAsPromised)

describe('Cloud Functions', () => {
  let myFunctions
  let configStub
  let adminInitStub
  let storageFileToRTDB
  let functions
  let admin
  let databaseStub
  let req
  let res
  console.log('`${__dirname}/../index`', `${__dirname}/../index`)
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
        storageBucket: 'not-a-project.appspot.com',
        projectId: "redux-firebasev3",
        storageBucket: "redux-firebasev3.appspot.com",
        messagingSenderId: "823357791673"
      },
      algolia: {
        api_key: "testing",
        app_id: "123"
      }
      // You can stub any other config values needed by your functions here, for example:
      // foo: 'bar'
    })
    // Now we can require index.js and save the exports inside a namespace called myFunctions.
    // This includes our cloud functions, which can now be accessed at myFunctions.asanaWebhook

    // if we use ../ without dirname here, it can not be run with --prefix from parent folder
    storageFileToRTDB = require(`../src/storageFileToRTDB`).copyFileToRTDB
    console.log("fake event", myFunctions)
  })

  after(() => {
    // Restoring our stubs to the original methods.
    configStub.restore()
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
        data: new functions.database.DeltaSnapshot(adminInitStub, adminInitStub, null, { filePath: 'testing' }, 'requests/fileToDb/123ABC')
        // To mock a database delete event:
        // data: new functions.database.DeltaSnapshot(null, null, 'old_data', null)
      }
      // Invoke webhook with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      storageFileToRTDB(fakeEvent)
    })
  })
  //
  // describe.skip('HTTP Function', () => {
  //   beforeEach(() => {
  //     // [START stubAdminDatabase]
  //     const refParam = '/messages'
  //     const pushParam = { original: 'input' }
  //     const refStub = sinon.stub()
  //     const pushStub = sinon.stub()
  //
  //     // The following 4 lines override the behavior of admin.database().ref('/messages')
  //     // .push({ original: 'input' }) to return a promise that resolves with { ref: 'new_ref' }.
  //     // This mimics the behavior of a push to the database, which returns an object containing a
  //     // ref property representing the URL of the newly pushed item.
  //     databaseStub = sinon.stub(admin, 'database')
  //     databaseStub.returns({ ref: refStub })
  //     refStub.withArgs(refParam).returns({ push: pushStub })
  //     pushStub.withArgs(pushParam).returns(Promise.resolve({ ref: 'new_ref' }))
  //   })
  //
  //   afterEach(() => {
  //     // Restoring admin.database() to the original method
  //     databaseStub.restore()
  //   })
  //
  //   it('responds with active message if there are no events', done => {
  //     // A fake request object, with req.query.text set to 'input'
  //     req = { headers: {} }
  //     // A fake response object, with a stubbed writeHead and end methods
  //     res = {
  //       writeHead: () => {},
  //       end: str => {
  //         assert.equal(str, 'Webhook is running!')
  //         done()
  //       }
  //     }
  //     // Invoke webhook with our fake request and response objects. This will cause the
  //     // assertions in the response object to be evaluated.
  //     myFunctions.someHttpFunc(req, res)
  //   })
  // })

})
