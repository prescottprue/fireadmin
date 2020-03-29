import * as admin from 'firebase-admin'
import fauxJax from 'faux-jax'

describe('indexUser RTDB Cloud Function (onWrite)', () => {
  let adminInitStub
  let indexUser
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
    indexUser = functionsTest.wrap(
      require(`${__dirname}/../../index`).indexUser
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

  // Skipped due to "Uncaught TypeError: server[kServerResponse] is not a constructor" on CI environment
  it.skip('removes user when user profile is being deleted', async function () {
    const res = await indexUser(
      { after: { exists: false } },
      { params: { userId: 'asdf' } }
    )
    expect(res).to.equal(null)
  })

  it('exits with null if display name did not change', async () => {
    const res = await indexUser({
      after: { exists: true, data: () => ({ displayName: 'asdf' }) },
      before: { exists: true, data: () => ({ displayName: 'asdf' }) }
    })
    expect(res).to.be.null
  })

  // Skipped due to "Uncaught TypeError: server[kServerResponse] is not a constructor" on CI environment
  it.skip('updates profile with new displayName if changed', async function () {
    const objectID = 'asdf'
    const afterData = { displayName: 'fdas' }
    const res = await indexUser(
      {
        after: { exists: true, data: () => afterData },
        before: { exists: true, data: () => ({ displayName: 'asdf' }) }
      },
      { params: { userId: objectID } }
    )
    expect(res).to.have.property('displayName', afterData.displayName)
    expect(res).to.have.property('objectID', objectID)
  })
})
