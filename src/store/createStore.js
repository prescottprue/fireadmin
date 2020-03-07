import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import reactReduxFirebase from 'react-redux-firebase/lib/enhancer'
import reduxFirestore from 'redux-firestore/lib/enhancer'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/storage'
// import logger from 'redux-logger'
import makeRootReducer from './reducers'
import { setErrorUser } from '../utils/errorHandler'
import { setAnalyticsUser } from '../utils/analytics'
import { initializeMessaging } from '../utils/messaging'
import config from '../config'
import { version } from '../../package.json'

export default (initialState = {}) => {
  // ======================================================
  // Window Vars Config
  // ======================================================
  window.version = version

  window.firebase = firebase

  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    thunk.withExtraArgument({})
    // This is where you add other middleware like redux-observable
  ]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (config.env !== 'prod') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__
    if (typeof devToolsExtension === 'function' && !window.Cypress) {
      enhancers.push(devToolsExtension())
    }
  }

  const defaultRRFConfig = {
    userProfile: 'users', // root that user profiles are written to
    updateProfileOnLogin: false, // enable/disable updating of profile on login
    useFirestoreForProfile: true,
    useFirestoreForStorageMeta: true,
    presence: 'presence',
    sessions: null,
    onAuthStateChanged: (authState, firebase, dispatch) => {
      if (authState) {
        // Set auth within error handler
        setErrorUser(authState)
        // Set auth within analytics
        setAnalyticsUser(authState)
        // Initalize messaging with dispatch
        initializeMessaging(dispatch)
      }
    }
  }

  const combinedConfig = config.reduxFirebase
    ? { ...defaultRRFConfig, ...config.reduxFirebase }
    : defaultRRFConfig

  // Use RTDB emulator
  if (process.env.REACT_APP_FIREBASE_DATABASE_EMULATOR_HOST) {
    config.firebase.databaseURL = `http://${process.env.REACT_APP_FIREBASE_DATABASE_EMULATOR_HOST}?ns=${config.firebase.projectId}`
    console.log('Using RTDB emulator', config.firebase) // eslint-disable-line
  }

  firebase.initializeApp(config.firebase)

  // Use Firestore emulator
  if (process.env.REACT_APP_FIRESTORE_EMULATOR_HOST) {
    const firestoreSettings = {
      host: process.env.REACT_APP_FIRESTORE_EMULATOR_HOST,
      ssl: false
    }
    console.log('Using Firestore emulator', firestoreSettings.host) // eslint-disable-line

    if (window.Cypress) {
      // Needed for Firestore support in Cypress (see https://github.com/cypress-io/cypress/issues/6350)
      firestoreSettings.experimentalForceLongPolling = true
    }

    firebase.firestore().settings(firestoreSettings)
  }

  // Use Functions emulator
  if (process.env.REACT_APP_FUNCTIONS_EMULATOR_HOST) {
    console.log('Using Functions emulator') // eslint-disable-line
    firebase
      .functions()
      .useFunctionsEmulator(process.env.REACT_APP_FUNCTIONS_EMULATOR_HOST)
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      reactReduxFirebase(firebase, combinedConfig),
      reduxFirestore(firebase),
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  // Setup hot module reloading to correctly replace reducers
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
