import * as admin from 'firebase-admin'

describe.skip('cleanupProject Firestore Cloud Function (onDelete)', () => {
  let adminInitStub
  let cleanupProject
  let firestoreStub = () => ({})
  let refStub // eslint-disable-line no-unused-vars
  let docStub
  let docSetStub // eslint-disable-line no-unused-vars
  let rtdbStub
  let setStub
  const resultOfSet = {}

  beforeEach(() => {
    // Stub Firebase's functions.config() (default in test/setup.js)
    // Stub Firebase's config environment var
    process.env.FIREBASE_CONFIG = JSON.stringify({
      databaseURL: 'https://some-project.firebaseio.com',
      storageBucket: 'some-bucket.appspot.com'
    })

    mockFunctionsConfig()
    /* eslint-disable global-require */
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Stub Firebase's functions.config()
    firestoreStub = sinon.stub()
    docStub = sinon.stub()
    docSetStub = sinon.stub()
    setStub = sinon.stub()
    rtdbStub = sinon.stub()
    setStub.returns(Promise.resolve(resultOfSet))
    docStub.returns({ set: setStub, once: () => Promise.resolve({}) })
    rtdbStub.returns({
      val: () => ({}),
      once: () => Promise.resolve(rtdbStub())
    })
    firestoreStub.returns({ doc: docStub })
    sinon.stub(admin, 'firestore').get(() => firestoreStub)
    // Syntax may change when this issue is addressed
    // [#2](https://github.com/firebase/firebase-functions-test/issues/2)
    cleanupProject = functionsTest.wrap(
      require(`${__dirname}/../../index`).cleanupProject
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
    // Restoring stubs to the original methods
    functionsTest.cleanup()
    adminInitStub.restore()
  })

  it('handles event', async () => {
    const fakeEvent = functionsTest.firestore.makeDocumentSnapshot(
      { foo: 'bar' },
      'projects/abc123'
    )
    const fakeContext = { params: { projectId: 'abc123' } }
    const res = await cleanupProject(fakeEvent, fakeContext)
    expect(res).to.be.null
  })
})
