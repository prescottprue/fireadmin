import * as admin from 'firebase-admin'
import { to } from 'utils/async'

const responsePath = 'responses/actionRunner/1'
const createdAt = 'timestamp'
const existingProjectId = 'existing'

describe('actionRunner RTDB Cloud Function (RTDB:onCreate)', function() {
  this.timeout(20000)
  let actionRunner
  let adminInitStub
  let databaseStub
  let setStub
  let refStub
  let docStub
  let collectionStub

  before(() => {
    // Stub Firebase's admin.initializeApp()
    adminInitStub = sinon.stub(admin, 'initializeApp')
  })

  after(() => {
    // Restore firebase-admin stub to the original
    adminInitStub.restore()
  })

  beforeEach(() => {
    // Stub Firebase's functions.config() (default in test/setup)
    mockFunctionsConfig()

    // Stubs for Firestore methods
    docStub = sinon.stub().returns({
      set: sinon.stub().returns(Promise.resolve({})),
      get: sinon.stub().returns(Promise.resolve({})),
      collection: sinon.stub().returns({
        add: sinon.stub().returns(Promise.resolve({})),
        doc: docStub
      })
    })
    docStub
      .withArgs(`projects/${existingProjectId}/environments/asdf`)
      .returns({
        get: sinon.stub().returns(
          Promise.resolve({
            data: () => ({ serviceAccount: { credential: 'asdf' } }),
            exists: true
          })
        )
      })
    collectionStub = sinon
      .stub()
      .returns({ add: sinon.stub().returns(Promise.resolve({})), doc: docStub })

    // Create Firestore stub out of stubbed methods
    const firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })

    // Apply stubs as admin.firestore()
    sinon.stub(admin, 'firestore').get(() => firestoreStub)
    admin.firestore.FieldValue = { serverTimestamp: () => createdAt }

    // Stubs for RTDB methods
    setStub = sinon.stub().returns(Promise.resolve({ ref: 'new_ref' }))
    refStub = sinon.stub().returns({ set: setStub, update: setStub })
    databaseStub = sinon.stub().returns({ ref: refStub })
    databaseStub.ServerValue = { TIMESTAMP: 'test' }

    // Apply stubs as admin.database()
    sinon.stub(admin, 'database').get(() => databaseStub)

    // Load wrapped version of Cloud Function
    actionRunner = functionsTest.wrap(
      require(`${__dirname}/../../index`).actionRunner
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
    // Restoring our test-level stubs to the original methods
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

  it('throws if action template is not an object', async () => {
    const snap = {
      val: () => ({ projectId: 'test', template: 'asdf' }),
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

  it('throws if action template does not contain steps', async () => {
    const snap = {
      val: () => ({ projectId: 'test', template: { asdf: 'asdf' } }),
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
      'Steps array was not provided to action request'
    )
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledWith({
      completed: true,
      completedAt: 'test',
      error: 'Steps array was not provided to action request',
      status: 'error'
    })
  })

  it('throws if action template does not contain inputs', async () => {
    const snap = {
      val: () => ({ projectId: 'test', template: { steps: [] } }),
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
      'Inputs array was not provided to action request'
    )
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledWith({
      completed: true,
      completedAt: 'test',
      error: 'Inputs array was not provided to action request',
      status: 'error'
    })
  })

  it('throws if action template does not contain inputValues', async () => {
    const snap = {
      val: () => ({ projectId: 'test', template: { steps: [], inputs: [] } }),
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
      'Input values array was not provided to action request'
    )
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledWith({
      completed: true,
      completedAt: 'test',
      error: 'Input values array was not provided to action request',
      status: 'error'
    })
  })

  it('Throws if inputValues are not passed', async () => {
    const snap = {
      val: () => ({
        projectId: 'test',
        template: { steps: [], inputs: [] }
      }),
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
      'Input values array was not provided to action request'
    )
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledWith({
      completed: true,
      completedAt: 'test',
      error: 'Input values array was not provided to action request',
      status: 'error'
    })
  })

  it('Throws if environment does not have databaseURL', async () => {
    const snap = {
      val: () => ({
        projectId: 'test',
        inputValues: [],
        environments: [{ type: 'test' }],
        template: { steps: [], inputs: [] }
      }),
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
      'databaseURL is required for action to authenticate through serviceAccount'
    )
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledWith({
      completed: true,
      completedAt: 'test',
      error:
        'databaseURL is required for action to authenticate through serviceAccount',
      status: 'error'
    })
  })

  it('Throws if environment does not an environment key or id', async () => {
    const snap = {
      val: () => ({
        projectId: 'test',
        inputValues: [],
        environments: [{ databaseURL: 'https://some-project.firebaseio.com' }],
        template: { steps: [], inputs: [] }
      }),
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
      'environmentKey or id is required for action to authenticate through serviceAccount'
    )
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledWith({
      completed: true,
      completedAt: 'test',
      error:
        'environmentKey or id is required for action to authenticate through serviceAccount',
      status: 'error'
    })
  })

  it('Throws if project does not contain serviceAccount', async () => {
    const id = 'asdf'
    const projectId = 'another'
    const snap = {
      val: () => ({
        projectId,
        inputValues: [],
        environments: [
          { databaseURL: 'https://some-project.firebaseio.com', id }
        ],
        template: { steps: [], inputs: [] }
      }),
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
      `Project containing service account not at path: projects/${projectId}/environments/${id}`
    )
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledWith({
      completed: true,
      completedAt: 'test',
      error: `Project containing service account not at path: projects/${projectId}/environments/${id}`,
      status: 'error'
    })
  })

  it('Throws if provided an invalid service account object (i.e. a string that is not an encrypted object)', async () => {
    const snap = {
      val: () => ({
        projectId: existingProjectId,
        inputValues: [],
        environments: [
          { databaseURL: 'https://some-project.firebaseio.com', id: 'asdf' }
        ],
        template: { steps: [], inputs: [] }
      }),
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
      'Service account not a valid object'
    )
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledWith({
      completed: true,
      completedAt: 'test',
      error: 'Service account not a valid object',
      status: 'error'
    })
  })

  // TODO: Unskip by passing a valid encrypted object
  it.skip('Works provided a valid template', async () => {
    const snap = {
      val: () => ({
        projectId: existingProjectId,
        inputValues: [],
        environments: [
          { databaseURL: 'https://some-project.firebaseio.com', id: 'asdf' }
        ],
        template: { steps: [], inputs: [] }
      }),
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
      'Steps array was not provided to action request'
    )
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledWith({
      completed: true,
      completedAt: 'test',
      error: 'Steps array was not provided to action request',
      status: 'error'
    })
  })

  // TODO: Unskip by passing a valid encrypted object
  it.skip('Works with backups', async () => {
    const snap = {
      val: () => ({
        projectId: 'test',
        inputValues: [],
        template: { steps: [], inputs: [], backups: [] }
      }),
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
      'Steps array was not provided to action request'
    )
    // Ref for response is correct path
    expect(refStub).to.have.been.calledWith(responsePath)
    // Error object written to response
    expect(setStub).to.have.been.calledWith({
      completed: true,
      completedAt: 'test',
      error: 'Steps array was not provided to action request',
      status: 'error'
    })
  })
})
