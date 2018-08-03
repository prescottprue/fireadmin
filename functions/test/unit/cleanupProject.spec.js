import * as admin from 'firebase-admin'

describe('cleanupProject Firestore Cloud Function (onDelete)', () => {
  let myFunctions
  let adminInitStub
  let cleanupProject

  before(() => {
    /* eslint-disable global-require */
    adminInitStub = sinon.stub(admin, 'initializeApp')
    myFunctions = require(`${__dirname}/../../index`)
    // Syntax may change when this issue is addressed
    // [#2](https://github.com/firebase/firebase-functions-test/issues/2)
    cleanupProject = functionsTest.wrap(myFunctions.cleanupProject)
    /* eslint-enable global-require */
  })

  after(() => {
    // Restoring stubs to the original methods
    functionsTest.cleanup()
    adminInitStub.restore()
  })

  it('handles event', async () => {
    // const fakeEvent = functionsTest.firestore.makeDocumentSnapshot({foo: 'bar'}, 'document/path');
    const fakeEvent = functionsTest.firestore.exampleDocumentSnapshot()
    const fakeContext = { params: {} }
    const res = await cleanupProject(fakeEvent, fakeContext)
    expect(res).to.be.null
  })
})
