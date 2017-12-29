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
  .onWrite(indexUser)

exports.indexMigrationTemplates = functions.firestore
  .document('/migrationTemplates/{templateId}')
  .onWrite(createIndexFunc('migrationTemplates', 'templateId'))

async function indexUser(event) {
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
  try {
    const algoliaResponse = await index.saveObject(firebaseObject)
    console.log('Object saved to Algolia successfully')
    return algoliaResponse
  } catch (err) {
    console.error('Error saving object to Algolia:', err.message || err)
    throw err
  }
}

function createIndexFunc(indexName, idParam, updateProps) {
  return event => {
    const index = client.initIndex(indexName)
    const data = event.data.data()
    // const previousData = event.data.previous.data()
    // TODO: Only re-index if a prop in the update props list is changed
    const firebaseObject = Object.assign({}, data, {
      objectID: event.params[idParam]
    })
    return index.saveObject(firebaseObject).then(algoliaResponse => {
      console.log('Object saved to Algolia successfully')
      return algoliaResponse
    })
  }
}
