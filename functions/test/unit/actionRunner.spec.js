import * as admin from 'firebase-admin'
const responsePath = `responses/actionRunner/1`

describe('actionRunner RTDB Cloud Function (RTDB:onCreate)', () => {
  let actionRunner
  let adminInitStub
  let databaseStub
  let refStub
  let setStub

  beforeEach(() => {
    // Stub Firebase's functions.config() (default in test/setup)
    mockFunctionsConfig()
    // Stub Firebase's admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp')
    databaseStub = sinon.stub()
    refStub = sinon.stub()
    setStub = sinon.stub()
    refStub.returns({ set: setStub, update: setStub })
    setStub.returns(Promise.resolve({ ref: 'new_ref' }))
    databaseStub.ServerValue = { TIMESTAMP: 'test' }
    databaseStub.returns({ ref: refStub })
    sinon.stub(admin, 'database').get(() => databaseStub)
    // Stub Firebase's functions.config()
    actionRunner = functionsTest.wrap(
      require(`${__dirname}/../../index`).actionRunner
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
    // Restoring our stubs to the original methods.
    adminInitStub.restore()
    functionsTest.cleanup()
  })

  it('throws and updates error if projectId is undefined', async () => {
    const snap = {
      val: () => ({})
    }
    const fakeContext = {
      params: { pushId: 1 }
    }
    let err
    try {
      await actionRunner(snap, fakeContext)
    } catch (error) {
      err = error
    }
    // Invoke with fake event object
    // Result is not set
    // expect(result).to.not.exist
    // Error thrown with correct message
    expect(err.message).to.equal('projectId parameter is required')
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledOnce
  })

  // TODO: UNSKIP
  // Currently skipped due to:
  //  Error: The default Firebase app does not exist. Make sure you call
  //  initializeApp() before using any of the Firebase services.
  it.skip('invokes successfully', async () => {
    const snap = {
      val: () => ({ projectId: 'test' }),
      ref: refStub()
    }
    const fakeContext = {
      params: { pushId: 1 }
    }
    // Invoke with fake event object
    const result = await actionRunner(snap, fakeContext)
    expect(result).to.exist
  })
})
