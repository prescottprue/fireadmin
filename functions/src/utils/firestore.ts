import { chunk, flatten } from 'lodash'
import { to, promiseWaterfall } from '../utils/async'

/**
 * Check if a slash path is a doc path
 * @param slashPath - Path to convert into firestore reference
 * @returns Whether or not path is a doc path
 * @example
 * isDocPath('projects') // => false
 * isDocPath('projects/asdf') // => true
 */
export function isDocPath(slashPath: string): boolean {
  // Remove leading and trailing slashes then split into array to see if length is even
  return (slashPath.replace(/^\/+|\/+$/g, '').split('/').length - 1) % 2 === 1
}

interface BatchWriteOptions {
  merge?: boolean
}

/**
 * Write document updates in a batch process.
 * @param firestoreInstance - Instance on which to create ref
 * @param destPath - Destination path under which data should be written
 * @param docData - List of docs to be written
 * @param opts - Options object (can contain merge)
 * @returns Resolves with results of batch commit
 */
export async function batchWriteDocs(
  firestoreInstance: any,
  destPath: string,
  docData: any[],
  opts?: BatchWriteOptions
): Promise<any> {
  const batch = firestoreInstance.batch()

  // Call set to dest for each doc within the original data
  docData.forEach(({ id, data }) => {
    const childRef = firestoreInstance.doc(`${destPath}/${id}`)
    batch.set(childRef, data, opts)
  })

  const [writeErr, writeRes] = await to(batch.commit())

  // Handle errors in batch write
  if (writeErr) {
    console.error(
      'Error batch copying between Firestore instances: ',
      { err: writeErr, destPath }
    )
    throw writeErr
  }

  return writeRes
}

const MAX_DOCS_PER_BATCH = 500

/**
 * Write documents to Firestore in batches. If there are more docs than
 * the max docs per batch count, multiple batches will be run in succession.
 * @param firestoreInstance - Instance on which to
 * create ref
 * @param destPath - Destination path under which data should be written
 * @param docData - List of docs to be written
 * @param opts - Options object (can contain merge)
 * @returns Resolves with results of batch commit
 */
export async function writeDocsInBatches(
  firestoreInstance: any,
  destPath: string,
  docData: any[],
  opts?: BatchWriteOptions
): Promise<any[]> {
  // Check if doc data is longer than max docs per batch
  if (docData?.length < MAX_DOCS_PER_BATCH) {
    console.log(
      `Updating all in once back since there are ${docData.length} updates and the max batch size is ${MAX_DOCS_PER_BATCH}`
    )

    // Less than the max number of docs in a batch
    return batchWriteDocs(firestoreInstance, destPath, docData, opts)
  }
  const docChunks = chunk(docData, MAX_DOCS_PER_BATCH)

  // More than max number of docs per batch - run multiple batches in succession
  const promiseResult = await promiseWaterfall(
    docChunks.map((dataChunk, chunkIdx) => {
      return () => {
        console.log(
          `Writing chunk #${chunkIdx} of ${docChunks.length} for path: ${destPath}`
        )
        return batchWriteDocs(firestoreInstance, destPath, dataChunk, opts)
      }
    })
  )

  // Flatten array of arrays (one for each chunk) into an array of results
  // and wrap in promise resolve
  return flatten(promiseResult)
}
