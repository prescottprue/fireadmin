import * as admin from 'firebase-admin'
import fauxJax from 'faux-jax'

describe('indexActionTemplates RTDB Cloud Function (onWrite)', () => {
  let adminInitStub
  let indexActionTemplates
  let updateStub
  let deleteStub
  let docStub
  let collectionStub

  beforeEach(() => {
    updateStub = sinon.stub().returns(Promise.resolve({}))
    deleteStub = sinon.stub().returns(Promise.resolve({}))
    docStub = sinon.stub().returns({ update: updateStub, delete: deleteStub })
    collectionStub = sinon
      .stub()
      .returns({ add: sinon.stub().returns(Promise.resolve({})), doc: docStub })
    // Apply stubs as admin.firestore()
    const firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })
    sinon.stub(admin, 'firestore').get(() => firestoreStub)
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Intercept all http requests and respond with 200
    fauxJax.install()
    fauxJax.on('request', function respond(request) {
      request.respond(200, {}, '{}')
    })
    // Set GCLOUD_PROJECT to env
    process.env.GCLOUD_PROJECT = 'test'
    /* eslint-disable global-require */
    indexActionTemplates = functionsTest.wrap(
      require(`${__dirname}/../../index`).indexActionTemplates
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
    adminInitStub.restore()
    functionsTest.cleanup()
    // Restore http request functionality
    fauxJax.restore()
    process.env.GCLOUD_PROJECT = undefined
  })

  it('exits with null if not public', async () => {
    const res = await indexActionTemplates({
      after: { exists: true, data: () => ({ displayName: 'asdf' }) },
      before: { exists: true, data: () => ({ displayName: 'asdf' }) }
    })
    expect(res).to.be.null
  })

  // Skipped due to "Uncaught TypeError: server[kServerResponse] is not a constructor" on CI environment
  it.skip('updates profile with new displayName if changed', async function () {
    const objectID = 'asdf'
    const res = await indexActionTemplates(
      {
        after: {
          exists: true,
          data: () => ({ public: true, another: 'thing' })
        },
        before: { exists: true, data: () => ({ another: 'original' }) }
      },
      { params: { templateId: objectID } }
    )
    expect(res).to.have.property('public', true)
    expect(res).to.have.property('another', 'thing')
    expect(res).to.have.property('objectID', objectID)
  })
})
