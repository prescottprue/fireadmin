import * as admin from 'firebase-admin'
import { to } from 'utils/async'

describe('cleanupProject Firestore Cloud Function (onDelete)', () => {
  let adminInitStub
  let cleanupProject
  let firestoreStub = () => ({})
  let refStub // eslint-disable-line no-unused-vars
  let docStub
  let docSetStub // eslint-disable-line no-unused-vars
  let rtdbStub
  let setStub
  const resultOfSet = {}

  beforeEach(() => {
    // Stub Firebase's functions.config() (default in test/setup.js)
    // Stub Firebase's config environment var
    process.env.FIREBASE_CONFIG = JSON.stringify({
      databaseURL: 'https://some-project.firebaseio.com',
      storageBucket: 'some-bucket.appspot.com'
    })
    adminInitStub = sinon.stub(admin, 'initializeApp')
    firestoreStub = sinon.stub()
    docStub = sinon.stub()
    docSetStub = sinon.stub()
    setStub = sinon.stub()
    rtdbStub = sinon.stub()
    setStub.returns(Promise.resolve(resultOfSet))
    docStub.returns({
      set: setStub,
      once: () => Promise.resolve({})
    })
    rtdbStub.returns({
      val: () => ({}),
      once: () => Promise.resolve(rtdbStub())
    })
    firestoreStub.returns({ doc: docStub })
    /* eslint-disable global-require */
    cleanupProject = functionsTest.wrap(
      require(`${__dirname}/../../index`).cleanupProject
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
      ref: { getCollections: () => Promise.resolve({}) }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const res = await cleanupProject(fakeEvent, fakeContext)
    expect(res).to.be.null
  })

  it('gracefully handles subcollections without any documents', async () => {
    const fakeEvent = {
      data: () => ({}),
      ref: {
        getCollections: () =>
          Promise.resolve([
            {
              ref: { getCollections: () => Promise.resolve([]) },
              get: sinon.stub().returns(Promise.resolve({}))
            }
          ])
      }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const res = await cleanupProject(fakeEvent, fakeContext)
    expect(res).to.be.null
  })

  it('handles error getting collection data', async () => {
    const fakeError = new Error('test')
    const fakeEvent = {
      data: () => ({}),
      ref: {
        getCollections: () =>
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
    const fakeEvent = {
      data: () => ({}),
      ref: {
        getCollections: () =>
          Promise.resolve([
            {
              ref: { getCollections: () => Promise.reject(fakeError) },
              get: sinon.stub().returns(Promise.resolve({}))
            }
          ])
      }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const [err] = await to(cleanupProject(fakeEvent, fakeContext))
    expect(err).to.have.property('message', fakeError.message)
  })

  it('Cleans up all data and subcollections for a project', async () => {
    const deleteStub = sinon.stub().returns(Promise.resolve())
    const fakeEvent = {
      data: () => ({}),
      ref: {
        getCollections: () =>
          Promise.resolve([
            {
              get: sinon.stub().returns(
                Promise.resolve({
                  size: 1,
                  forEach: feCb => {
                    feCb({ ref: { delete: deleteStub } })
                  }
                })
              )
            }
          ])
      }
    }
    const fakeContext = { params: { projectId: 'abc123' } }
    const res = await cleanupProject(fakeEvent, fakeContext)
    expect(res).to.be.null
    expect(deleteStub).to.have.been.calledOnce
  })

  it('Handles error deleting subcollection document for a project', async () => {
    const fakeError = new Error('test')
    const deleteStub = sinon.stub().returns(Promise.reject(fakeError))
    const fakeEvent = {
      data: () => ({}),
      ref: {
        getCollections: () =>
          Promise.resolve([
            {
              get: sinon.stub().returns(
                Promise.resolve({
                  size: 1,
                  forEach: feCb => {
                    feCb({ ref: { delete: deleteStub } })
                  }
                })
              )
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
