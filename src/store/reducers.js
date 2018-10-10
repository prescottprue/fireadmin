import { combineReducers } from 'redux'
import { firebaseStateReducer as firebase } from 'react-redux-firebase'
import { reducer as firestore } from 'redux-firestore'
import { persistReducer } from 'redux-persist'
import localStorage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import { reducer as form } from 'redux-form'
import locationReducer from './location'
import { reducer as notifications } from 'modules/notification'

export const makeRootReducer = asyncReducers => {
  return combineReducers({
    // Add sync reducers here
    firebase: persistReducer(
      { key: 'firepersist', storage: localStorage, stateReconciler: hardSet },
      firebase
    ),
    firestore,
    form,
    location: locationReducer,
    notifications,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
