import * as functions from 'firebase-functions'
import { encrypt } from '../utils/encryption'
import { to } from '../utils/async'
import { downloadFromStorage } from '../utils/cloudStorage'

/**
 * @name copyServiceAccountToFirestore
 * Copy service account to Firestore from Cloud Storage when new service
 * account meta data is added to Firestore
 * @type {functions.CloudFunction}
 */
export default functions.firestore
  .document(
    'projects/{projectId}/environments/{environmentId}'
    // 'projects/{projectId}/environments/{envrionmentId}/serviceAccounts/{serviceAccountId}' // for serviceAccounts as subcollection
  )
  .onCreate(handleServiceAccountCreate)

/**
 * Download service account from Cloud Storage and store it as an encrypted
 * string within Firestore. Could be a storage function, but it
 * would require more code due to being triggered for all storage files.
 * @param  {functions.Event} event - Function event triggered when adding a new
 * service account to a project
 * @return {Promise} Resolves with filePath
 */
export async function handleServiceAccountCreate(snap) {
  const eventData = snap.val()
  if (!eventData.serviceAccount) {
    throw new Error(
      'serviceAccount parameter is required to copy service account to Firestore'
    )
  }
  const {
    serviceAccount: { fullPath }
  } = eventData
  // Download service account from Cloud Storage
  const [downloadErr, fileData] = await to(downloadFromStorage(null, fullPath))

  // Handle errors downloading service account
  if (downloadErr) {
    console.error(
      'Error downloading service account from storage:',
      downloadErr.message || downloadErr
    )
    throw downloadErr
  }

  // Write encrypted service account data to serviceAccount parameter of environment document
  const [updateErr] = await to(
    snap.ref.update('serviceAccount', {
      ...eventData.serviceAccount,
      credential: encrypt(fileData)
    })
  )

  // Handle errors updating Firestore with service account
  if (updateErr) {
    console.error(
      'Error updating Firestore with service account:',
      updateErr.message || updateErr
    )
    throw updateErr
  }

  console.log(
    'Service account copied to Firestore, cleaning up...',
    event.params
  )
  return fileData
}
