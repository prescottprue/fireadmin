import { expect } from 'chai';
import sinon from 'sinon';
import * as admin from 'firebase-admin'
import functionsTestLib from 'firebase-functions-test'
import { mockFunctionsConfig } from '../utils'

const functionsTest = functionsTestLib()

describe('onUserOnlineStatusChange RTDB Cloud Function (RTDB:onUpdate)', () => {
  let onUserOnlineStatusChange
  let adminInitStub
  let firestoreStub
  let docStub
  let setStub
  const resultOfSet = {}

  before(() => {
    // Stub Firebase's functions.config() (default in test/setup)
    mockFunctionsConfig()
    adminInitStub = sinon.stub(admin, 'initializeApp')
    setStub = sinon.stub().returns(Promise.resolve(resultOfSet))
    docStub = sinon.stub().returns({ set: setStub, once: () => Promise.resolve({}) })
    // Stub Firebase's admin.initializeApp
    firestoreStub = sinon.stub().returns({ doc: docStub })
    sinon.stub(admin, 'firestore').get(() => firestoreStub)
    // Stub Firebase's functions.config()
    onUserOnlineStatusChange = functionsTest.wrap(
      require(`${__dirname}/../../src/onUserOnlineStatusChange`).default
    )
    /* eslint-enable global-require */
  })

  after(() => {
    // Restoring our stubs to the original methods.
    functionsTest.cleanup()
    adminInitStub.restore()
  })

  it('exit if the current timestamp is newer the event trigger', async () => {
    const beforeValue = { displayName: 'some', filePath: 'some' }
    const afterName = { displayName: 'other', filePath: 'some' }
    const fakeContext = {
      params: { filePath: 'testing', userId: 1 }
    }
    const before = functionsTest.database.makeDataSnapshot(beforeValue, 'users/ABC123')
    const after = {
      val: sinon.stub().returns({ last_changed: 123 }),
      ref: {
        once: sinon.stub().returns(Promise.resolve({ val: sinon.stub().returns({ last_changed: 234 }) }))
      }
    }
    // Invoke with fake event object
    const result = await onUserOnlineStatusChange(
      { before, after },
      fakeContext
    )
    // expect(setStub).to.have.been.calledWith()
    expect(result).to.equal(null)
  })

  it('returns result of set', async () => {
    const beforeValue = { displayName: 'some', filePath: 'some' }
    const afterName = { displayName: 'other', filePath: 'some' }
    const fakeContext = {
      params: { filePath: 'testing', userId: 1 }
    }
    const before = functionsTest.database.makeDataSnapshot(beforeValue, 'users/ABC123')
    const after = {
      val: sinon.stub().returns({ last_changed: 234 }),
      ref: {
        once: sinon.stub().returns(Promise.resolve({ val: sinon.stub().returns({ last_changed: 123 }) }))
      }
    }
    // Invoke with fake event object
    const result = await onUserOnlineStatusChange(
      { before, after },
      fakeContext
    )
    // expect(setStub).to.have.been.calledWith()
    expect(result).to.equal(resultOfSet)
  })
})
