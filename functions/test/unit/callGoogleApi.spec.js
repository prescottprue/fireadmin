import * as admin from 'firebase-admin'
import fauxJax from 'faux-jax'
import { to } from 'utils/async'

describe('callGoogleApi RTDB Cloud Function (onCreate)', () => {
  let adminInitStub
  let callGoogleApi
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
    // Stub Firebase's config environment var
    process.env.FIREBASE_CONFIG = JSON.stringify({
      databaseURL: 'https://some-project.firebaseio.com',
      storageBucket: 'some-bucket.appspot.com'
    })
    /* eslint-disable global-require */
    callGoogleApi = functionsTest.wrap(
      require(`${__dirname}/../../index`).callGoogleApi
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

  it('throws if request does not contain projectId, environment or storageBucket', async () => {
    const objectID = 'asdf'
    const [err] = await to(
      callGoogleApi(
        {
          val: () => ({ api: 'compute' })
        },
        { params: { templateId: objectID } }
      )
    )
    expect(err).to.have.property(
      'message',
      'projectId, environment, and storageBucket are required parameters'
    )
  })
})
