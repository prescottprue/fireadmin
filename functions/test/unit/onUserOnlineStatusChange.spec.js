import * as admin from 'firebase-admin'

describe('onUserOnlineStatusChange RTDB Cloud Function (RTDB:onUpdate)', () => {
  let onUserOnlineStatusChange
  let adminInitStub
  let firestoreStub = () => ({ doc: sinon.stub({ set: sinon.stub() }) })
  let refStub // eslint-disable-line no-unused-vars
  let docStub
  let docSetStub // eslint-disable-line no-unused-vars
  let rtdbStub
  let setStub
  const resultOfSet = {}

  beforeEach(() => {
    // Stub Firebase's functions.config() (default in test/setup)
    mockFunctionsConfig()
    // Stub Firebase's admin.initializeApp
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
    // Stub Firebase's functions.config()
    onUserOnlineStatusChange = functionsTest.wrap(
      require(`${__dirname}/../../index`).onUserOnlineStatusChange
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
    // Restoring our stubs to the original methods.
    functionsTest.cleanup()
    adminInitStub.restore()
  })

  it('invokes successfully', async () => {
    const snap = {
      val: () => ({ displayName: 'some', filePath: 'some' }),
      ref: rtdbStub()
    }
    const fakeContext = {
      params: { filePath: 'testing', userId: 1 }
    }
    // Invoke with fake event object
    const result = await onUserOnlineStatusChange(
      { before: snap, after: snap },
      fakeContext
    )
    expect(result).to.equal(resultOfSet)
  })
})
