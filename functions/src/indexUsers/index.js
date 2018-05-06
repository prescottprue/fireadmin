import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import { get } from 'lodash'
import { createIndexFunc } from '../utils/search'

// Updates the search index when users are created or displayName is updated
export default functions.firestore.document('/users/{userId}').onWrite(
  createIndexFunc({
    indexName: 'users',
    idParam: 'userId',
    indexCondition: (user, change) => {
      const previousData = change.before.data()
      const nameChanged =
        get(user, 'displayName') !== get(previousData, 'displayName')
      if (nameChanged) {
        console.log('Display name changed re-indexing...')
      } else {
        console.log(
          'Display name did not change, no reason to re-index. Exiting...'
        )
      }
      return nameChanged
    },
    otherPromises: [
      (user, objectID) =>
        admin
          .database()
          .ref(`displayNames/${objectID}`)
          .set(get(user, 'displayName'))
    ]
  })
)
