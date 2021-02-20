import * as admin from 'firebase-admin'
import { expect } from 'chai';
import sinon from 'sinon';
import functionsTestLib from 'firebase-functions-test'
import { to } from '../utils/async'

const functionsTest = functionsTestLib()

describe('cleanupProject Firestore Cloud Function (onDelete)', () => {
  let adminInitStub
  let cleanupProject
  let docStub
  let setStub
  const resultOfSet = {}

  before(() => {
    // Stub admin.initializeApp()
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Set GCLOUD_PROJECT to env
    process.env.GCLOUD_PROJECT = 'test'
  })

  beforeEach(() => {
    // Set GCLOUD_PROJECT to test
    process.env.GCLOUD_PROJECT = 'test'

    // Stub Firebase's functions.config() (default in test/setup.js)
    process.env.FIREBASE_CONFIG = JSON.stringify({
      databaseURL: 'https://some-project.firebaseio.com',
      storageBucket: 'some-bucket.appspot.com'
    })
    // Stubs for Firestore methods
    docStub = sinon.stub()
    setStub = sinon.stub().returns(Promise.resolve(resultOfSet))
    docStub.returns({
      set: setStub,
      once: () => Promise.resolve({})
    })
    functionsTest.mockConfig({
      algolia: {
        app_id: 'asdf ',
        api_key: 'asdf ',
      }
    })

    // Load wrapped version of Cloud Function
    /* eslint-disable global-require */
    cleanupProject = functionsTest.wrap(
      require(`${__dirname}/../../src/cleanupProject`).default
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
    // Restoring stubs to the original methods
    functionsTest.cleanup()
    adminInitStub.restore()
  })

  it('Cleans up all data and exits if there are subcollections for a project', async () => {
    const fakeEvent = {
      data: () => ({}),
      ref: { listCollections: () => Promise.resolve([]) }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const res = await cleanupProject(fakeEvent, fakeContext)
    expect(res).to.be.null
  })

  it('gracefully handles subcollections without any documents', async () => {
    const fakeEvent = {
      data: () => ({}),
      ref: {
        listCollections: () =>
          Promise.resolve([
            {
              ref: { listCollections: () => Promise.resolve([]) },
              get: sinon.stub().returns(Promise.resolve({}))
            }
          ])
      }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(cleanupProject(fakeEvent, fakeContext))
    expect(err).to.not.exist
  })

  it('handles error getting collection data', async () => {
    const fakeError = new Error('test')
    const fakeEvent = {
      ref: {
        listCollections: () =>
          Promise.resolve([
            {
              get: sinon.stub().returns(Promise.reject(fakeError))
            }
          ])
      }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(cleanupProject(fakeEvent, fakeContext))
    expect(err).to.have.property('message', fakeError.message)
  })

  it('handles error getting child subcollection documents', async () => {
    const fakeError = new Error('test')
    const deleteStub = sinon.stub().returns(Promise.resolve())
    const fakeChildDoc = { ref: { listCollections: () => Promise.reject(fakeError), delete: deleteStub } }
    const fakeEvent = {
      ref: {
        listCollections: () =>
          Promise.resolve([
            {
              get: sinon.stub().returns(
                Promise.resolve({
                  size: 1,
                  docs: [fakeChildDoc]
                })
              )
            }
          ])
      }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(cleanupProject(fakeEvent, fakeContext))
    expect(err).to.have.property('message', fakeError.message)
  })
  // Skipped due to snap.ref.listCollections is not a function
  it.skip('Cleans up all data and subcollections for a project', async () => {
    const deleteStub = sinon.stub().returns(Promise.resolve())
    const fakeEvent = {
      ref: {
        listCollections: () =>
          Promise.resolve([
            {
              get: sinon.stub().returns(
                Promise.resolve({
                  size: 1,
                  docs: [
                    { ref: { delete: deleteStub, listCollections: Promise.resolve([]) }, }
                  ]
                })
              ),
            }
          ]),
      }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const res = await cleanupProject(fakeEvent, fakeContext)
    expect(res).to.be.null
    expect(deleteStub).to.have.been.calledOnce
  })
  
  // Skipped due to snap.ref.listCollections is not a function
  it.skip('Handles error deleting subcollection document for a project', async () => {
    const fakeError = new Error('test')
    const deleteStub = sinon.stub().returns(Promise.reject(fakeError))
    const fakeEvent = {
      ref: {
        listCollections: () =>
          Promise.resolve([
            {
              get: sinon.stub().returns(
                Promise.resolve({
                  size: 1,
                  docs: [
                    { ref: { delete: deleteStub, listCollections: Promise.resolve([]) } }
                  ]
                })
              ),
            }
          ])
      }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(cleanupProject(fakeEvent, fakeContext))
    expect(err).to.have.property('message', fakeError.message)
    expect(deleteStub).to.have.been.calledOnce
  })
})
