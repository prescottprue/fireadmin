import algoliasearch from 'algoliasearch'
import * as functions from 'firebase-functions'

// Authenticate to Algolia Database
const client = algoliasearch(
  functions.config().algolia.app_id,
  functions.config().algolia.api_key
)

interface IndexPromiseFunc {
  (data: any, objectID: string)
}

interface CreateIndexFuncParams {
  indexName: string
  idParam: string
  indexCondition: (
    data: any,
    change: functions.Change<functions.firestore.DocumentSnapshot>
  ) => boolean
  otherPromises?: any[]
}

/**
 * Creates a function indexs item within Algolia from a function event.
 * @param {string} options - Options object
 * @param {string} options.indexName - name of Algolia index under which to place item
 * @param {string} options.idParam - Parameter which contains id
 * @param {Function} options.indexCondition - Function that decides conditions under
 * which item is index. If provided, it must return truthy in order for item
 * to be indexed.
 * @returns {Function} Cloud Function event handler function
 */
export function createIndexFunc({
  indexName,
  idParam,
  indexCondition,
  otherPromises = []
}: CreateIndexFuncParams): (
  change: functions.Change<functions.firestore.DocumentSnapshot>,
  context: functions.EventContext
) => any {
  return (change, context): null | Promise<any> => {
    const index = client.initIndex(indexName)
    const { [idParam]: objectID } = context.params
    // Remove the item from algolia if it is being deleted
    if (!change.after.exists) {
      console.log(
        `Object with ID: ${objectID} being deleted, deleting from Algolia index: ${indexName} ... `
      )
      return index.deleteObject(objectID).then(() => {
        console.log(
          `Object with ID: ${objectID} successfully deleted from index: ${indexName} on Algolia. Exiting.`
        )
        return null
      })
    }
    const data = change.after.data()
    // Check if index indexCondition is a function
    if (typeof indexCondition === 'function') {
      // Only re-index if indexCondition function returns truthy
      if (!indexCondition(data, change)) {
        console.log('Item index indexCondition provided and not met. Exiting.')
        return null
      }
      console.log('Item index indexCondition provided met. Indexing item.')
    }
    const firebaseObject = Object.assign({}, data, { objectID })
    return Promise.all([
      index.saveObject(firebaseObject).then((algoliaResponse) => {
        console.log(
          `Object with ID: ${objectID} successfully saved to index: ${indexName} on Algolia successfully. Exiting.`
        )
        return algoliaResponse
      }),
      ...otherPromises.map((otherPromiseCreator: IndexPromiseFunc) =>
        otherPromiseCreator(data, objectID)
      )
    ]).then(() => firebaseObject)
  }
}
