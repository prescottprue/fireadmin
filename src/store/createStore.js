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
import { persistStore, persistReducer } from 'redux-persist'
// import logger from 'redux-logger'
import makeRootReducer from './reducers'
import { updateLocation } from './location'
import { setAnalyticsUser } from '../utils/analytics'
import { initializeMessaging } from '../utils/messaging'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
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
    thunk.withExtraArgument(getFirebase)
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
  const persistConfig = {
    key: 'root',
    storage
  }
  const persistedReducer = persistReducer(persistConfig, makeRootReducer())
  const store = createStore(
    persistedReducer,
    initialState,
    compose(
      reactReduxFirebase(window.fbInstance || firebase, combinedConfig),
      reduxFirestore(window.fbInstance || firebase),
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store))

  // Setup hot module reloading to correctly replace reducers
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  // Setup Store Persistor
  const persistor = persistStore(store)

  return { store, persistor }
}
