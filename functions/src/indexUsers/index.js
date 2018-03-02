import { get, invoke } from 'lodash'
import { createIndexFunc } from '../utils/search'
const functions = require('firebase-functions')

// Updates the search index when users are created or displayName is updated
export default functions.firestore.document('/users/{userId}').onWrite(
  createIndexFunc({
    indexName: 'users',
    idParam: 'userId',
    indexCondition: (user, data) => {
      const previousData = invoke(data, 'previous.data')
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
    }
  })
)
