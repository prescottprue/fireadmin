import { encrypt } from './utils/encryption'
import { to } from './utils/async'
import { downloadFromStorage } from './utils/cloudStorage'
const functions = require('firebase-functions')

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
async function handleServiceAccountCreate(event) {
  // const { fullPath } = event.data.data() // for serviceAccounts as subcollection
  const eventData = event.data.data()
  if (!eventData.serviceAccount) {
    throw new Error(
      'serviceAccount parameter is required to copy service account to Firestore'
    )
  }
  const { serviceAccount: { fullPath } } = eventData
  // const fileName = path.basename(tempLocalPath) // File Name
  const [downloadErr, fileData] = await to(downloadFromStorage(null, fullPath))
  if (downloadErr) throw downloadErr
  // Write encrypted service account data to serviceAccount parameter of environment document
  const [updateErr] = await to(
    event.data.ref.update('serviceAccount', {
      ...eventData.serviceAccount,
      credential: encrypt(fileData)
    })
  )
  if (updateErr) throw updateErr
  console.log(
    'Service account copied to Firestore, cleaning up...',
    event.params
  )
  return fileData
}
