import * as admin from 'firebase-admin'

describe('onUserOnlineStatusChange RTDB Cloud Function (RTDB:onUpdate)', () => {
  let onUserOnlineStatusChange
  let adminInitStub
  let databaseStub
  let firestoreStub = () => ({ doc: sinon.stub({ set: sinon.stub() }) })
  let refStub
  let docStub
  let docSetStub
  let setStub

  beforeEach(() => {
    // Stub Firebase's admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Stub Firebase's functions.config()
    databaseStub = sinon.stub()
    firestoreStub = sinon.stub()
    refStub = sinon.stub()
    setStub = sinon.stub()
    docStub = sinon.stub()
    docSetStub = sinon.stub()
    refStub.returns({ set: setStub })
    setStub.returns(Promise.resolve({ ref: 'new_ref' }))
    databaseStub.ServerValue = { TIMESTAMP: 'test' }
    databaseStub.returns({ ref: refStub })
    docStub.returns({ set: docSetStub })
    firestoreStub.returns({ doc: docStub })
    sinon.stub(admin, 'database').get(() => databaseStub)
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
      val: () => ({ displayName: 'some', filePath: 'some' })
    }
    const fakeContext = {
      params: { filePath: 'testing', userId: 1 }
    }
    // Invoke with fake event object
    const result = await onUserOnlineStatusChange(
      { before: snap, after: snap },
      fakeContext
    )
    expect(result).to.exist
  })
})
