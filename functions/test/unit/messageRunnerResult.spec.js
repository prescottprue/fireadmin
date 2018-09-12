import * as admin from 'firebase-admin'
const userId = 1
const refParam = `users_public/${userId}`

describe('messageRunnerResult RTDB Cloud Function (onWrite)', () => {
  let adminInitStub
  let messageRunnerResult

  before(() => {
    adminInitStub = sinon.stub(admin, 'initializeApp')
    process.env.GCLOUD_PROJECT = 'test'
    // Stub Firebase's config environment var
    process.env.FIREBASE_CONFIG = JSON.stringify({
      databaseURL: 'https://some-project.firebaseio.com',
      storageBucket: 'some-bucket.appspot.com'
    })
    /* eslint-disable global-require */
    messageRunnerResult = functionsTest.wrap(
      require(`${__dirname}/../../index`).messageRunnerResult
    )
    /* eslint-enable global-require */
  })

  after(() => {
    adminInitStub.restore()
    functionsTest.cleanup()
  })

  it('handles event', async () => {
    const databaseStub = sinon.stub()
    const refStub = sinon.stub()
    const removeStub = sinon.stub()

    refStub.withArgs(refParam).returns({ remove: removeStub })
    removeStub.returns(Promise.resolve({ ref: 'new_ref' }))
    databaseStub.returns({ ref: refStub })
    sinon.stub(admin, 'database').get(() => databaseStub)
    const snap = {
      val: () => null
    }
    const fakeContext = {
      params: { filePath: 'testing', userId: 1 }
    }

    const res = await messageRunnerResult({ after: snap }, fakeContext)
    expect(res).to.be.null
  })
})
