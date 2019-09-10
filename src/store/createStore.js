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
import {
  firebase as fbConfig,
  reduxFirebase as rrfConfig,
  env
} from '../config'
import { version } from '../../package.json'

export default (initialState = {}) => {
  // ======================================================
  // Window Vars Config
  // ======================================================
  window.version = version

  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    thunk.withExtraArgument({})
    // This is where you add other middleware like redux-observable
  ]

  if (env === 'local') {
    // Add redux-logger to log action dispatches
    // middleware.push(logger)
  }

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (env === 'local') {
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__
    if (typeof devToolsExtension === 'function') {
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

  const combinedConfig = rrfConfig
    ? { ...defaultRRFConfig, ...rrfConfig }
    : defaultRRFConfig

  // Initialize Firebase only if an fbInstance was not passed to the window (tests)
  if (!window.fbInstance) {
    firebase.initializeApp(fbConfig)
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      reactReduxFirebase(window.fbInstance || firebase, combinedConfig),
      reduxFirestore(window.fbInstance || firebase),
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
