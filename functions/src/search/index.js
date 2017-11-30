const functions = require('firebase-functions')
// const admin = require('firebase-admin')

// Authenticate to Algolia Database.
// TODO: Make sure you configure the `algolia.app_id` and `algolia.api_key` Google Cloud environment variables.
const algoliasearch = require('algoliasearch')
const client = algoliasearch(
  functions.config().algolia.app_id,
  functions.config().algolia.api_key
)

// Name fo the algolia index for Blog posts content.
const ALGOLIA_POSTS_INDEX_NAME = 'users'

// Updates the search index when new blog entries are created or updated.
exports.indexUsers = functions.firestore
  .document('/users/{userId}')
  .onWrite(event => {
    const index = client.initIndex(ALGOLIA_POSTS_INDEX_NAME)
    const data = event.data.data()
    const previousData = event.data.previous.data()

    // We'll only update if the displayName has changed.
    if (data.displayName === previousData.displayName) {
      console.log(
        'Display name did not change, no reason to re-index. Exiting...'
      )
      return
    }

    const firebaseObject = Object.assign({}, data, {
      objectID: event.params.userId
    })

    return index
      .saveObject(firebaseObject)
      .then(() =>
        event.data.adminRef.parent
          .child('last_index_timestamp')
          .set(Date.parse(event.timestamp))
      )
  })
