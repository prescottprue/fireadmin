import fs from 'fs'
import { expect } from 'chai';
import sinon from 'sinon';
import * as admin from 'firebase-admin'
import functionsTestLib from 'firebase-functions-test'
import { to } from '../utils/async'

const functionsTest = functionsTestLib()

functionsTest.mockConfig({
  encryption: {
    password: 'asdf'
  }
})

describe('copyServiceAccountToFirestore Firestore Cloud Function (onCreate)', () => {
  let copyServiceAccountToFirestore
  let refStub // eslint-disable-line no-unused-vars
  let adminInitStub
  let storageAdminStub

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
          delete: sinon.stub().returns(Promise.resolve({})),
          // Mock download method with invalid JSON file data
          download: sinon.spy(({ destination }) => {
            fs.writeFileSync(
              destination,
              JSON.stringify({ asdf: 'asdf' }, null, 2)
            )
            return Promise.resolve({ asdf: 'asdf' })
          })
        })
      })
    })
    storageAdminStub = sinon.stub(admin, 'storage').get(() => storageStub)

    // Load wrapped version of Cloud Function
    /* eslint-disable global-require */
    copyServiceAccountToFirestore = functionsTest.wrap(
      require(`${__dirname}/../../src/copyServiceAccountToFirestore`).default
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
    // Restoring stubs to the original methods
    functionsTest.cleanup()
    storageAdminStub.restore()
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

    // Modified stub with error to run over existing
    const storageStub = sinon.stub().returns({
      bucket: sinon.stub().returns({
        file: sinon.stub().returns({
          // Mock download method with promise rejection matching cloud storage
          download: sinon
            .stub()
            .returns(
              Promise.reject(new Error('A file name must be specified.'))
            )
        })
      })
    })
    storageAdminStub = sinon.stub(admin, 'storage').get(() => storageStub)
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

    // Modified stub with error to run over existing
    const storageStub = sinon.stub().returns({
      bucket: sinon.stub().returns({
        file: sinon.stub().returns({
          // Mock download method with promise rejection matching cloud storage
          download: sinon.stub().returns(Promise.reject(new Error('Not Found')))
        })
      })
    })
    storageAdminStub = sinon.stub(admin, 'storage').get(() => storageStub)
    const [err] = await to(
      copyServiceAccountToFirestore(fakeEvent, fakeContext)
    )
    expect(err).to.have.property('message', 'Not Found')
  })

  // Skipped due to "Cannot read property 'password' of undefined" - from config not being picked up
  it.skip('updates reference with serviceAccount param', async () => {
    const fakeEventData = { serviceAccount: { fullPath: 'test' } }

    const fakeEvent = {
      data: () => fakeEventData,
      ref: {
        update: sinon.stub().returns(Promise.resolve({}))
      }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const res = await copyServiceAccountToFirestore(fakeEvent, fakeContext)
    expect(res).to.be.null
  })
})
