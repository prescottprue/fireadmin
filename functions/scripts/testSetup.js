const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

// Stub Firebase's config environment var
process.env.FIREBASE_CONFIG = JSON.stringify({
  databaseURL: 'https://some-project.firebaseio.com',
  storageBucket: 'some-bucket.appspot.com'
})
