const glob = require('glob')
const path = require('path')
const admin = require('firebase-admin')
const functions = require('firebase-functions')
const initializeFireadminLib = require('@fireadmin/core').initialize
const getEnvConfig = require('./dist/utils/firebaseFunctions').getEnvConfig

// Initialize Firebase so it is available within functions
try {
  admin.initializeApp(functions.config().firebase)
} catch (e) {
  /* istanbul ignore next: not called in tests */
  console.error(
    'Caught error initializing app with functions.config():',
    e.message || e
  )
}
try {
  const serviceAccount = getEnvConfig('service_account')
  const fireadminApp = admin.initializeApp(
    {
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    },
    'withServiceAccount'
  )
  initializeFireadminLib(fireadminApp)
} catch (e) {
  /* istanbul ignore next: not called in tests */
  console.error('Caught error initializing fireadmin lib:', e.message || e)
}

const codeFolder = process.env.NODE_ENV === 'test' ? './src' : './dist'

// Load all folders within dist directory (mirrors layout of src)
const files = glob.sync(codeFolder + '/**/index.js', {
  cwd: __dirname,
  ignore: [
    './node_modules/**',
    codeFolder + '/utils/**',
    codeFolder + '/constants'
  ]
})

// Loop over all folders found within dist loading only the relevant function
files.forEach(functionFile => {
  // Get folder name from file name (removing any dashes)
  const folderName = path
    .basename(path.dirname(functionFile))
    .replace(/[-]/g, '')

  // Load single function from default
  !process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === folderName // eslint-disable-line no-unused-expressions
    ? (exports[folderName] = require(functionFile).default) // eslint-disable-line global-require
    : () => {}
})
