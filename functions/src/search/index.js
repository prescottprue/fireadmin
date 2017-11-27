const functions = require('firebase-functions')
const admin = require('firebase-admin')

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
exports.indexentry = functions.database
  .ref('/users/{blogid}/text')
  .onWrite(event => {
    const index = client.initIndex(ALGOLIA_POSTS_INDEX_NAME)
    const firebaseObject = Object.assign({}, event.data.val(), {
      objectID: event.params.blogid
    })

    return index
      .saveObject(firebaseObject)
      .then(() =>
        event.data.adminRef.parent
          .child('last_index_timestamp')
          .set(Date.parse(event.timestamp))
      )
  })

// Starts a search query whenever a query is requested (by adding one to the `/search/queries`
// element. Search results are then written under `/search/results`.
exports.searchentry = functions.database
  .ref('/search/queries/{queryid}')
  .onWrite(event => {
    const index = client.initIndex(ALGOLIA_POSTS_INDEX_NAME)
    const key = event.data.key

    return index.search(event.data.val()).then(content => {
      const updates = {
        '/search/last_query_timestamp': Date.parse(event.timestamp)
      }
      updates[`/search/results/${key}`] = content
      return admin
        .database()
        .ref()
        .update(updates)
    })
  })
