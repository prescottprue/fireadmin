import { applyMiddleware, compose, createStore } from 'redux'
import thunk from 'redux-thunk'
import { browserHistory } from 'react-router'
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'
import { reduxFirestore } from 'redux-firestore'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'
import 'firebase/storage'
import { setAnalyticsUser } from '../utils/analytics'
import makeRootReducer from './reducers'
import { firebase as fbConfig, reduxFirebase as rrfConfig } from '../config'
import { version } from '../../package.json'
import { updateLocation } from './location'

export default (initialState = {}) => {
  // ======================================================
  // Window Vars Config
  // ======================================================
  window.version = version

  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    thunk.withExtraArgument(getFirebase)
    // This is where you add other middleware like redux-observable
  ]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEV__) {
    const devToolsExtension = window.devToolsExtension
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
    onAuthStateChanged: authState => {
      if (authState) {
        setAnalyticsUser(authState)
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

  // Initialize Firestore with settings
  firebase.firestore().settings({ timestampsInSnapshots: true })

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      reduxFirestore(window.fbInstance || firebase),
      reactReduxFirebase(window.fbInstance || firebase, combinedConfig),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}
