const admin = require('firebase-admin')
const glob = require('glob')
const path = require('path')

try {
  admin.initializeApp()
} catch (err) {}

// Load all folders within dist directory (mirrors layout of src)
const files = glob.sync('./dist/**/index.js', {
  cwd: __dirname,
  ignore: ['./node_modules/**', './dist/utils/**', './dist/constants']
})

// Loop over all folders found within dist loading only the relevant function
files.forEach(functionFile => {
  const folderName = path
    .basename(path.dirname(functionFile))
    .replace(/[-]/g, '.')
  // Load single function from default
  !process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === folderName // eslint-disable-line no-unused-expressions
    ? (exports[folderName] = require(functionFile).default) // eslint-disable-line global-require
    : () => {}
})
