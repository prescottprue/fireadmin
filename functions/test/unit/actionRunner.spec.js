import * as admin from 'firebase-admin'
const responsePath = `responses/actionRunner/1`

describe('actionRunner RTDB Cloud Function (RTDB:onCreate)', () => {
  let actionRunner
  let adminInitStub
  let databaseStub
  let refStub
  let setStub

  beforeEach(() => {
    // Stub Firebase's admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Stub Firebase's functions.config()
    actionRunner = functionsTest.wrap(
      require(`${__dirname}/../../index`).actionRunner
    )
    databaseStub = sinon.stub()
    refStub = sinon.stub()
    setStub = sinon.stub()
    refStub.returns({ set: setStub })
    setStub.returns(Promise.resolve({ ref: 'new_ref' }))
    databaseStub.ServerValue = { TIMESTAMP: 'test' }
    databaseStub.returns({ ref: refStub })
    sinon.stub(admin, 'database').get(() => databaseStub)
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
    // Invoke with fake event object
    const [err, result] = await to(actionRunner(snap, fakeContext))
    // Result is not set
    expect(result).to.not.exist
    // Error thrown with correct message
    expect(err.message).to.equal('projectId parameter is required')
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledOnce
  })

  it('invokes successfully', async () => {
    const snap = {
      val: () => ({ projectId: 'test' })
    }
    const fakeContext = {
      params: { pushId: 1 }
    }
    // Invoke with fake event object
    const result = await actionRunner(snap, fakeContext)
    expect(result).to.exist
  })
})
