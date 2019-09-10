import { combineReducers } from 'redux'
import firebase from 'react-redux-firebase/lib/reducer'
import firestore from 'redux-firestore/lib/reducer'
import { reducer as form } from 'redux-form'
import locationReducer from './location'
import { reducer as notifications } from 'modules/notification'

export const makeRootReducer = asyncReducers => {
  return combineReducers({
    // Add sync reducers here
    firebase,
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
