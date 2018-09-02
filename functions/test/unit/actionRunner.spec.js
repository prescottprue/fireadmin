import * as admin from 'firebase-admin'
import { to } from 'utils/async'
const responsePath = `responses/actionRunner/1`

describe('actionRunner RTDB Cloud Function (RTDB:onCreate)', function() {
  this.timeout(20000)
  let actionRunner
  let adminInitStub
  let databaseStub
  let setStub
  let getStub
  let refStub
  let docStub
  let collectionStub

  beforeEach(() => {
    // Stub Firebase's functions.config() (default in test/setup)
    mockFunctionsConfig()
    setStub = sinon.stub().returns(Promise.resolve({}))
    getStub = sinon.stub().returns(Promise.resolve({}))
    refStub = sinon.stub().returns({ set: setStub })
    docStub = sinon.stub().returns({
      set: setStub,
      get: getStub,
      collection: sinon.stub().returns({
        add: sinon.stub().returns(Promise.resolve({})),
        doc: docStub
      })
    })
    collectionStub = sinon
      .stub()
      .returns({ add: sinon.stub().returns(Promise.resolve({})), doc: docStub })
    databaseStub = sinon.stub()
    // Stub Firebase's admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp')
    refStub = sinon.stub()
    setStub = sinon.stub()
    refStub.returns({ set: setStub, update: setStub })
    setStub.returns(Promise.resolve({ ref: 'new_ref' }))
    databaseStub.ServerValue = { TIMESTAMP: 'test' }
    databaseStub.returns({ ref: refStub })
    sinon.stub(admin, 'database').get(() => databaseStub)
    // Apply stubs as admin.firestore()
    const firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })
    sinon.stub(admin, 'firestore').get(() => firestoreStub)
    const createdAt = 'timestamp'
    admin.firestore.FieldValue = { serverTimestamp: () => createdAt }
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
    // Invoke with fake event object
    const [err] = await to(actionRunner(snap, fakeContext))
    // Confir error thrown with correct message
    expect(err).to.have.property('message', 'projectId parameter is required')
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledOnce
  })

  it('throws if action template is not included', async () => {
    const snap = {
      val: () => ({ projectId: 'test' }),
      ref: refStub()
    }
    const fakeContext = {
      params: { pushId: 1 }
    }
    // Invoke with fake event object
    const [err] = await to(actionRunner(snap, fakeContext))
    // Response marked as started
    expect(setStub).to.have.been.calledWith({
      startedAt: 'test',
      status: 'started'
    })
    // Confir error thrown with correct message
    expect(err).to.have.property(
      'message',
      'Action template is required to run steps'
    )
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledWith({
      completed: true,
      completedAt: 'test',
      error: 'Action template is required to run steps',
      status: 'error'
    })
  })
})
