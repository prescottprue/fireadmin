import * as admin from 'firebase-admin'
import fauxJax from 'faux-jax'
import { to } from 'utils/async'
import crypto from 'crypto'

describe('callGoogleApi RTDB Cloud Function (onCreate)', () => {
  let adminInitStub
  let callGoogleApi
  let updateStub
  let getStub
  let docStub
  let collectionStub
  let firestoreStub
  let encryptedSa

  beforeEach(() => {
    updateStub = sinon.stub().returns(Promise.resolve({}))
    getStub = sinon.stub().returns(Promise.resolve({}))
    docStub = sinon.stub().returns({ update: updateStub, get: getStub })
    collectionStub = sinon
      .stub()
      .returns({ add: sinon.stub().returns(Promise.resolve({})), doc: docStub })
    // Apply stubs as admin.firestore()
    firestoreStub = sinon
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

  it('throws if service account is not found for provided project', async () => {
    const objectID = 'asdf'
    const [err] = await to(
      callGoogleApi(
        {
          val: () => ({
            api: 'compute',
            projectId: 'asdf',
            environment: 'test',
            storageBucket: 'asdf'
          })
        },
        { params: { templateId: objectID } }
      )
    )
    expect(err).to.have.property(
      'message',
      'Project containing service account not at path: projects/asdf/environments/test'
    )
  })

  it('throws if credential parameter is missing on serviceAccount object', async () => {
    const objectID = 'asdf'
    // Stub subcollection document get
    getStub = sinon
      .stub()
      .returns(Promise.resolve({ exists: true, data: () => ({}) }))
    docStub = sinon.stub().returns({ get: getStub })
    // Stub collection with stubbed doc
    collectionStub = sinon.stub().returns({ doc: docStub })
    // Apply stubs as admin.firestore()
    firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })
    const [err] = await to(
      callGoogleApi(
        {
          val: () => ({
            api: 'compute',
            projectId: 'asdf',
            environment: 'test',
            storageBucket: 'asdf'
          })
        },
        { params: { templateId: objectID } }
      )
    )
    expect(err).to.have.property(
      'message',
      'Credential parameter is required to load service account from Firestore'
    )
  })

  it('Throws for invalid service account string (not an object)', async () => {
    const objectID = 'asdf'
    // Stub subcollection document get
    getStub = sinon.stub().returns(
      Promise.resolve({
        exists: true,
        data: () => ({ serviceAccount: { credential: 'asdf' } })
      })
    )
    docStub = sinon.stub().returns({ update: updateStub, get: getStub })
    collectionStub = sinon
      .stub()
      .returns({ add: sinon.stub().returns(Promise.resolve({})), doc: docStub })
    // Apply stubs as admin.firestore()
    firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })
    const [err] = await to(
      callGoogleApi(
        {
          val: () => ({
            projectId: 'asdf',
            environment: 'test',
            storageBucket: 'asdf'
          })
        },
        { params: { templateId: objectID } }
      )
    )
    expect(err).to.have.property(
      'message',
      'Service account not a valid object'
    )
  })

  it('throws for invalid service account object loaded from Firestore for a valid project', async () => {
    encryptedSa = encrypt(JSON.stringify({ project_id: 'test' }, null, 2))
    const fakeEnvDoc = { serviceAccount: { credential: encryptedSa } }
    const objectID = 'asdf'
    // Stub subcollection document get
    getStub = sinon.stub().returns(
      Promise.resolve({
        exists: true,
        data: () => fakeEnvDoc
      })
    )
    docStub = sinon.stub().returns({ update: updateStub, get: getStub })
    collectionStub = sinon
      .stub()
      .returns({ add: sinon.stub().returns(Promise.resolve({})), doc: docStub })
    // Apply stubs as admin.firestore()
    firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })
    const [err] = await to(
      callGoogleApi(
        {
          val: () => ({
            projectId: 'asdf',
            environment: 'test',
            storageBucket: 'asdf'
          })
        },
        { params: { templateId: objectID } }
      )
    )
    // Message thrown for non encrypted string (not a buffer)
    expect(err).to.have.property('message', 'Invalid service account')
  })

  it('throws for invalid service account object loaded from Firestore for a valid project', async () => {
    encryptedSa = encrypt(
      JSON.stringify(
        {
          type: 'service_account',
          project_id: 'asdf',
          private_key_id: 'asdf',
          private_key: 'asdf',
          client_email: 'asdf',
          client_id: 'asdf',
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://accounts.google.com/o/oauth2/token',
          auth_provider_x509_cert_url:
            'https://www.googleapis.com/oauth2/v1/certs',
          client_x509_cert_url: 'asdf'
        },
        null,
        2
      )
    )
    const fakeEnvDoc = { serviceAccount: { credential: encryptedSa } }
    const objectID = 'asdf'
    // Stub subcollection document get
    getStub = sinon.stub().returns(
      Promise.resolve({
        exists: true,
        data: () => fakeEnvDoc
      })
    )
    docStub = sinon.stub().returns({ update: updateStub, get: getStub })
    collectionStub = sinon
      .stub()
      .returns({ add: sinon.stub().returns(Promise.resolve({})), doc: docStub })
    // Apply stubs as admin.firestore()
    firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })
    const [err] = await to(
      callGoogleApi(
        {
          val: () => ({
            projectId: 'asdf',
            environment: 'test',
            storageBucket: 'asdf'
          })
        },
        { params: { templateId: objectID } }
      )
    )
    // Message thrown for stubbed service account object passed
    expect(err).to.have.property(
      'message',
      'error:0906D06C:PEM routines:PEM_read_bio:no start line'
    )
  })
})

const TEST_PASSWORD = 'asdf'

/**
 * Encrypt a string using a password. encryption.password from
 * functions config is used by default if not passed.
 * @param {String} text - Text string to encrypt
 * @param {Object} [options={}]
 * @param {Object} [options.algorithm='aes-256-ctr']
 * @param {Object} options.password - Password to use while
 * encrypting. encryption.password from functions config is used
 * by default if not passed.
 */
function encrypt(text, options = {}) {
  const { algorithm = 'aes-256-ctr' } = options
  const cipher = crypto.createCipher(algorithm, TEST_PASSWORD)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}
