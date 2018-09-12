const ip = require('ip')
const NODE_ENV = process.env.NODE_ENV || 'development'
const PORT = 3000
const TEST_DIR = 'test'

module.exports = {
  /** The environment to use when building the project */
  env: NODE_ENV,
  /** The port that is used for local development */
  port: PORT,
  /** The full path to the project's root directory */
  basePath: __dirname,
  /** The name of the directory containing the application source code */
  srcDir: 'src',
  /** The file name of the application's entry point */
  main: 'main',
  /** The name of the directory in which to emit compiled assets */
  outDir: 'dist',
  /** The base path for all projects assets (relative to the website root) */
  publicPath:
    NODE_ENV === 'development' ? `http://${ip.address()}:${PORT}/` : '/',
  /** The base path for all projects tests */
  testDir: TEST_DIR,
  /** The base path for project unit tests */
  unitTestDir: `${TEST_DIR}/unit`,
  /** The base path for project e2e tests */
  e2eTestDir: `${TEST_DIR}/e2e`,
  /** Whether to generate sourcemaps */
  sourcemaps: true,
  /** A hash map of keys that the compiler should treat as external to the project */
  externals: {},
  /** A hash map of variables and their values to expose globally */
  globals: {},
  /** Whether to enable verbose logging */
  verbose: false,
  /** The list of modules to bundle separately from the core application code */
  vendors: [
    'react',
    'react-dom',
    'redux',
    'react-redux',
    'redux-thunk',
    'react-router',
    'react-redux-firebase'
  ]
}
