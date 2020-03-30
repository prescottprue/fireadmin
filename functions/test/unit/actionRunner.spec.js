import * as admin from 'firebase-admin'
import { to } from 'utils/async'
import { encrypt } from 'utils/encryption'
import fs from 'fs'

const responsePath = 'responses/actionRunner/1'
const createdAt = 'timestamp'
const existingProjectId = 'existing'

describe('actionRunner RTDB Cloud Function (RTDB:onCreate)', function () {
  this.timeout(20000)
  let actionRunner
  let adminInitStub
  let databaseStub
  let setStub
  let refStub
  let docStub
  let collectionStub
  let parentStorageStub
  let parentFirestoreStub

  before(() => {
    parentStorageStub = sinon.stub().returns({
      bucket: sinon.stub().returns({
        file: sinon.stub().returns({
          delete: sinon.stub().returns(Promise.resolve({})),
          // Mock download method with invalid JSON file data
          download: sinon.spy(({ destination }) => {
            fs.writeFileSync(
              destination,
              JSON.stringify({ asdf: 'asdf' }, null, 2)
            )
            return Promise.resolve({ asdf: 'asdf' })
          })
        }),
        upload: sinon.stub().returns(Promise.resolve({}))
      })
    })
    // Stub Firebase's admin.initializeApp()
    parentFirestoreStub = sinon.stub().returns({
      collection: sinon.stub().returns({
        get: sinon
          .stub()
          .returns(
            Promise.resolve({ data: () => ({ some: 'value' }), exists: true })
          ),
        firestore: {
          batch: sinon.stub().returns({
            commit: sinon.stub().returns(Promise.resolve()),
            set: sinon.stub().returns({})
          }),
          collection: sinon.stub().returns({
            doc: sinon.stub().returns({}),
            get: sinon.stub().returns(
              Promise.resolve({
                data: () => ({ some: 'value' }),
                exists: true
              })
            )
          })
        },
        doc: sinon.stub().returns({
          get: sinon.stub().returns(Promise.resolve({ data: () => ({}) })),
          set: sinon.stub().returns(Promise.resolve(null)),
          path: 'projects/my-project'
        }),
        path: 'projects'
      }),
      doc: sinon.stub().returns({
        update: sinon.stub().returns(Promise.resolve())
      })
    })

    parentFirestoreStub.batch = sinon.stub().returns({
      set: sinon.stub().returns(Promise.resolve()),
      commit: sinon.stub().returns(Promise.resolve())
    })
    adminInitStub = sinon.stub(admin, 'initializeApp').returns({
      firestore: parentFirestoreStub,
      database: sinon.stub().returns({
        ref: sinon.stub().returns({
          once: sinon.stub().returns(Promise.resolve({ val: () => ({}) })),
          update: sinon.stub().returns(Promise.resolve())
        })
      }),
      storage: parentStorageStub
    })
    sinon.stub(admin.credential, 'cert')
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
    collectionStub = sinon.stub().returns({
      add: sinon.stub().returns(Promise.resolve({})),
      doc: docStub
    })

    // Create Firestore stub out of stubbed methods
    const firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })

    // Apply stubs as admin.firestore()
    sinon.stub(admin, 'firestore').get(() => firestoreStub)
    admin.firestore.FieldValue = { serverTimestamp: () => createdAt }

    // Stubs for RTDB methods
    setStub = sinon.stub().returns(Promise.resolve({ ref: 'new_ref' }))
    refStub = sinon.stub().returns({
      set: setStub,
      update: setStub,
      push: sinon.stub().returns(Promise.resolve({}))
    })
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

  describe('Invalid Action Template', () => {
    it('Throws and updates error if projectId is undefined', async () => {
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

    it('Throws if action template is not included', async () => {
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

    it('Throws if action template is not an object', async () => {
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

    it('Throws if action template does not contain steps', async () => {
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

    it('Throws if action template does not contain inputs', async () => {
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

    it('Throws if action template does not contain inputValues', async () => {
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
          environments: [
            { databaseURL: 'https://some-project.firebaseio.com' }
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

    it('Throws if template contains invalid steps', async () => {
      const validProjectId = 'aosidjfoaisjdfoi'
      docStub.withArgs(`projects/${validProjectId}/environments/asdf`).returns({
        get: sinon.stub().returns(
          Promise.resolve({
            data: () => ({
              serviceAccount: {
                credential: encrypt({
                  type: 'service_account',
                  project_id: 'asdf',
                  private_key_id: 'asdf',
                  private_key: 'asdf',
                  client_email: 'asdf',
                  client_id: 'sadf',
                  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                  token_uri: 'https://accounts.google.com/o/oauth2/token',
                  auth_provider_x509_cert_url:
                    'https://www.googleapis.com/oauth2/v1/certs',
                  client_x509_cert_url: 'asdf'
                })
              }
            }),
            exists: true
          })
        )
      })
      const snap = {
        val: () => ({
          projectId: validProjectId,
          inputValues: ['projects'],
          environments: [
            {
              databaseURL: 'https://some-project.firebaseio.com',
              id: 'asdf'
            }
          ],
          template: {
            steps: [
              {
                type: 'copy'
              }
            ],
            inputs: []
          }
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
      // Confirm res
      expect(err).to.have.property(
        'message',
        'Error running step: 0 : src, dest and src.resource are required to run step'
      )
      // Ref for response is correct path
      expect(refStub).to.have.been.calledWith(responsePath)
      // Success object written to response
      expect(setStub).to.have.been.calledWith({
        completed: true,
        completedAt: 'test',
        error:
          'Error running step: 0 : src, dest and src.resource are required to run step',
        status: 'error'
      })
    })
  })

  describe('Action template with type "copy"', () => {
    function createValidActionRunnerStubs(opts) {
      const {
        projectId = 'asdfasdf1',
        srcResource = 'rtdb',
        destResource = 'rtdb',
        inputValues = ['projects']
      } = opts || {}
      // Environment Doc Stub (subcollection of project document)
      const environmentDocStub = docStub
        .withArgs(`projects/${projectId}/environments/asdf`)
        .returns({
          get: sinon.stub().returns(
            Promise.resolve({
              data: () => ({
                serviceAccount: {
                  credential: encrypt({
                    type: 'service_account',
                    project_id: 'asdf',
                    private_key_id: 'asdf',
                    private_key: 'asdf',
                    client_email: 'asdf',
                    client_id: 'sadf',
                    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
                    token_uri: 'https://accounts.google.com/o/oauth2/token',
                    auth_provider_x509_cert_url:
                      'https://www.googleapis.com/oauth2/v1/certs',
                    client_x509_cert_url: 'asdf'
                  })
                }
              }),
              exists: true
            })
          )
        })
      // Event DataSnapshot stub
      const snapStub = {
        val: () => ({
          projectId,
          inputValues,
          environments: [
            {
              databaseURL: 'https://some-project.firebaseio.com',
              id: 'asdf'
            },
            {
              databaseURL: 'https://some-project.firebaseio.com',
              id: 'asdf'
            }
          ],
          template: {
            steps: [
              {
                type: 'copy',
                dest: { pathType: 'input', path: 0, resource: destResource },
                src: { pathType: 'input', path: 0, resource: srcResource }
              }
            ],
            inputs: [{ type: 'userInput' }]
          }
        }),
        ref: refStub()
      }
      return {
        snapStub,
        environmentDocStub
      }
    }

    describe('with src: "firestore" and dest: "firestore"', () => {
      it('successfully copies a single document between Firestore instances', async () => {
        const { snapStub } = createValidActionRunnerStubs({
          srcResource: 'firestore',
          destResource: 'firestore',
          inputValues: ['projects/my-project']
        })
        const fakeContext = {
          params: { pushId: 1 }
        }
        // Invoke with fake event object
        const res = await actionRunner(snapStub, fakeContext)
        // Response marked as started
        expect(setStub).to.have.been.calledWith({
          startedAt: 'test',
          status: 'started'
        })
        // Confirm res
        expect(res).to.be.null
        // Ref for response is correct path
        expect(refStub).to.have.been.calledWith(responsePath)
        // Success object written to response
        expect(setStub).to.have.been.calledWith({
          completed: true,
          completedAt: 'test',
          status: 'success'
        })
      })

      it('successfully copies multiple documents between Firestore instances', async function () {
        // this.retries(3) // retry to avoid file already exists error for serviceAccount
        const { snapStub } = createValidActionRunnerStubs({
          srcResource: 'firestore',
          destResource: 'firestore'
        })
        const fakeContext = {
          params: { pushId: 1 }
        }
        // Invoke with fake event object
        const res = await actionRunner(snapStub, fakeContext)
        // Response marked as started
        expect(setStub).to.have.been.calledWith({
          startedAt: 'test',
          status: 'started'
        })
        // Confirm res
        expect(res).to.be.null
        // Ref for response is correct path
        expect(refStub).to.have.been.calledWith(responsePath)
        // Success object written to response
        expect(setStub).to.have.been.calledWith({
          completed: true,
          completedAt: 'test',
          status: 'success'
        })
      })
    })

    describe('with src: "firestore" and dest: "rtdb"', () => {
      it('successfully copies from Firestore to Real Time Database', async () => {
        const { snapStub } = createValidActionRunnerStubs({
          srcResource: 'firestore',
          destResource: 'rtdb'
        })
        const fakeContext = {
          params: { pushId: 1 }
        }
        // Invoke with fake event object
        const res = await actionRunner(snapStub, fakeContext)
        // Response marked as started
        expect(setStub).to.have.been.calledWith({
          startedAt: 'test',
          status: 'started'
        })
        // Confirm res
        expect(res).to.be.null
        // Ref for response is correct path
        expect(refStub).to.have.been.calledWith(responsePath)
        // Success object written to response
        expect(setStub).to.have.been.calledWith({
          completed: true,
          completedAt: 'test',
          status: 'success'
        })
      })
    })

    describe('with src "rtdb" and dest: "rtdb"', () => {
      it('successfully copies between RTDB instances', async () => {
        const { snapStub } = createValidActionRunnerStubs()
        const fakeContext = {
          params: { pushId: 1 }
        }
        // Invoke with fake event object
        const res = await actionRunner(snapStub, fakeContext)
        // Response marked as started
        expect(setStub).to.have.been.calledWith({
          startedAt: 'test',
          status: 'started'
        })
        // Confirm res
        expect(res).to.be.null
        // Ref for response is correct path
        expect(refStub).to.have.been.calledWith(responsePath)
        // Success object written to response
        expect(setStub).to.have.been.calledWith({
          completed: true,
          completedAt: 'test',
          status: 'success'
        })
      })
    })

    describe('with src: "rtdb" and dest: "firestore"', () => {
      it('successfully copies from RTDB to Firestore', async () => {
        const { snapStub } = createValidActionRunnerStubs({
          srcResource: 'rtdb',
          destResource: 'firestore'
        })
        const fakeContext = {
          params: { pushId: 1 }
        }
        // Invoke with fake event object
        const res = await actionRunner(snapStub, fakeContext)
        // Response marked as started
        expect(setStub).to.have.been.calledWith({
          startedAt: 'test',
          status: 'started'
        })
        // Confirm res
        expect(res).to.be.null
        // Ref for response is correct path
        expect(refStub).to.have.been.calledWith(responsePath)
        // Success object written to response
        expect(setStub).to.have.been.calledWith({
          completed: true,
          completedAt: 'test',
          status: 'success'
        })
      })
    })

    describe('with src: "rtdb" and dest: "storage"', () => {
      it('successfully copies from RTDB to Cloud Storage', async () => {
        const { snapStub } = createValidActionRunnerStubs({
          srcResource: 'rtdb',
          destResource: 'storage'
        })
        const fakeContext = {
          params: { pushId: 1 }
        }
        // Invoke with fake event object
        const res = await actionRunner(snapStub, fakeContext)
        // Response marked as started
        expect(setStub).to.have.been.calledWith({
          startedAt: 'test',
          status: 'started'
        })
        // Confirm res
        expect(res).to.be.null
        // Ref for response is correct path
        expect(refStub).to.have.been.calledWith(responsePath)
        // Success object written to response
        expect(setStub).to.have.been.calledWith({
          completed: true,
          completedAt: 'test',
          status: 'success'
        })
      })
    })

    describe('with src: "storage" and dest: "rtdb"', () => {
      it('successfully copies from Cloud Storage to RTDB', async () => {
        const { snapStub } = createValidActionRunnerStubs({
          srcResource: 'storage',
          destResource: 'rtdb'
        })
        const fakeContext = {
          params: { pushId: 1 }
        }
        // Invoke with fake event object
        const res = await actionRunner(snapStub, fakeContext)
        // Response marked as started
        expect(setStub).to.have.been.calledWith({
          startedAt: 'test',
          status: 'started'
        })
        // Confirm res
        expect(res).to.be.null
        // Ref for response is correct path
        expect(refStub).to.have.been.calledWith(responsePath)
        // Success object written to response
        expect(setStub).to.have.been.calledWith({
          completed: true,
          completedAt: 'test',
          status: 'success'
        })
      })
    })
  })

  describe('Action template with backups', () => {
    it('Calls backups before running steps', async () => {
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
      const res = await actionRunner(snap, fakeContext)
      // Response marked as started
      expect(setStub).to.have.been.calledWith({
        startedAt: 'test',
        status: 'started'
      })
      // Confirm res
      expect(res).to.be.null
      // Ref for response is correct path
      expect(refStub).to.have.been.calledWith(responsePath)
      // Success object written to response
      expect(setStub).to.have.been.calledWith({
        completed: true,
        completedAt: 'test',
        status: 'success'
      })
    })
  })
})
