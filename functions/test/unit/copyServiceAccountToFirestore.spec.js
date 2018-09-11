import * as admin from 'firebase-admin'
import { to } from 'utils/async'

describe('copyServiceAccountToFirestore Firestore Cloud Function (onCreate)', () => {
  let copyServiceAccountToFirestore
  let refStub // eslint-disable-line no-unused-vars
  let docSetStub // eslint-disable-line no-unused-vars
  let adminInitStub

  before(() => {
    // Stub Firebase's admin.initializeApp()
    adminInitStub = sinon.stub(admin, 'initializeApp')
  })

  after(() => {
    // Restore firebase-admin stub to the original
    adminInitStub.restore()
  })

  beforeEach(() => {
    // Set GCLOUD_PROJECT to env
    process.env.GCLOUD_PROJECT = 'test'
    const storageStub = sinon.stub().returns({
      bucket: sinon.stub().returns({
        file: sinon.stub().returns({
          download: sinon.stub().returns(Promise.resolve({}))
        })
      })
    })
    sinon.stub(admin, 'storage').get(() => storageStub)
    // Load wrapped version of Cloud Function
    /* eslint-disable global-require */
    copyServiceAccountToFirestore = functionsTest.wrap(
      require(`${__dirname}/../../index`).copyServiceAccountToFirestore
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
    // Restoring stubs to the original methods
    functionsTest.cleanup()
  })

  it('throws if service account paramter is not provided', async () => {
    const fakeEvent = {
      data: () => ({})
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(
      copyServiceAccountToFirestore(fakeEvent, fakeContext)
    )
    expect(err).to.have.property(
      'message',
      'serviceAccount parameter is required to copy service account to Firestore'
    )
  })

  it('throws for non-existant service account path', async () => {
    const fakeEventData = { serviceAccount: { test: 'asdf' } }
    const fakeEvent = {
      data: () => fakeEventData
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(
      copyServiceAccountToFirestore(fakeEvent, fakeContext)
    )
    expect(err).to.have.property('message', 'A file name must be specified.')
  })

  it('throws for service account path that points to non existing file', async () => {
    const fakeEventData = { serviceAccount: { fullPath: 'test' } }
    const fakeEvent = {
      data: () => fakeEventData
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(
      copyServiceAccountToFirestore(fakeEvent, fakeContext)
    )
    expect(err).to.have.property('message', 'Not Found')
  })

  // Skipped due to issues mocking Google Cloud Storage library
  // TODO: Unskip once GCS is switched with Firebase's admin.storage()
  it.skip('throws if downloaded service account file can not be read as JSON', async () => {
    const fakeEventData = { serviceAccount: { fullPath: 'test' } }

    const fakeEvent = {
      data: () => fakeEventData,
      ref: {
        update: sinon.stub().returns(Promise.resolve({}))
      }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(
      copyServiceAccountToFirestore(fakeEvent, fakeContext)
    )
    expect(err).to.have.property('message', 'Error saving file as JSON')
  })

  // Skipped due to issues mocking Google Cloud Storage library
  // TODO: Unskip once GCS is switched with Firebase's admin.storage()
  it.skip('updates reference with serviceAccount param', async () => {
    const fakeEventData = { serviceAccount: { fullPath: 'test' } }

    const fakeEvent = {
      data: () => fakeEventData,
      ref: {
        update: sinon.stub().returns(Promise.resolve({}))
      }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(
      copyServiceAccountToFirestore(fakeEvent, fakeContext)
    )
    expect(err).to.have.property('message', 'Error saving file as JSON')
  })
})
