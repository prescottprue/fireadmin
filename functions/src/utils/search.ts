import algoliasearch from 'algoliasearch'
import * as functions from 'firebase-functions'

interface IndexPromiseFunc {
  (data: any, objectID: string)
}

interface IndexFunc {
  (
    change: functions.Change<functions.firestore.DocumentSnapshot>,
    context: functions.EventContext
  ): Promise<null>
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
 * Creates a function indexes item within Algolia from a function event.
 * @param options - Options object
 * @param options.indexName - name of Algolia index under which to place item
 * @param options.idParam - Parameter which contains id
 * @param options.indexCondition - Function that decides conditions under
 * which item is index. If provided, it must return truthy in order for item
 * to be indexed.
 * @returns Cloud Function event handler function
 */
export function createIndexFunc({
  indexName,
  idParam,
  indexCondition,
  otherPromises = []
}: CreateIndexFuncParams): IndexFunc {
  // Authenticate to Algolia Database
  const client = algoliasearch(
    functions.config().algolia.app_id,
    functions.config().algolia.api_key
  )
  return async (change, context): Promise<null> => {
    const index = client.initIndex(indexName)
    const { [idParam]: objectID } = context.params

    // Remove the item from Algolia if it is being deleted
    if (!change.after.exists) {
      console.log(
        `Object with ID: ${objectID} being deleted, deleting from Algolia index: ${indexName} ... `
      )
      await index.deleteObject(objectID)
      console.log(
        `Object with ID: ${objectID} successfully deleted from index: ${indexName} on Algolia. Exiting.`
      )
      return null
    }

    const data = change.after.data()
    // Check if index indexCondition is a function
    if (typeof indexCondition === 'function') {
      // Only re-index if indexCondition function returns truthy
      if (!indexCondition(data, change)) {
        console.log('Item index indexCondition provided and not met. Exiting.')
        return null
      }
      console.log('Item index indexCondition provided was met. Indexing item.')
    }

    const firebaseObject = { ...data, objectID }

    try {
      await Promise.all([
        index.saveObject(firebaseObject),
        ...otherPromises.map((otherPromiseCreator: IndexPromiseFunc) =>
          otherPromiseCreator(data, objectID)
        )
      ])
    } catch(err) {
      console.error('Error running index promises:', err)
      throw err
    }

    console.log(`Successfully indexed object with id ${objectID}`)

    return null
  }
}
