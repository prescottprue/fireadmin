import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { map, pick } from 'lodash'
import { to } from '../utils/async'
import { handleServiceAccountCreate } from '../copyServiceAccountToFirestore'

/**
 * @name moveServiceAccounts
 * Cloud Function triggered by Real Time Database Create Event
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref('/requests/moveServiceAccounts/{pushId}')
  .onCreate(moveServiceAccountsEvent)

/**
 * @param  {functions.Event} event - Function event
 * @return {Promise}
 */
async function moveServiceAccountsEvent(snap, context) {
  // const { params, auth, timestamp } = context
  // const eventData = snap.val()
  const ref = admin.database().ref('serviceAccounts')
  const [writeErr, serviceAccountsSnap] = await to(ref.once('value'))
  if (writeErr) {
    console.error(`Error writing response: ${writeErr.message || ''}`, writeErr)
    throw writeErr
  }
  const accountsByProject = []
  serviceAccountsSnap.forEach(snap => {
    accountsByProject.push({ projectId: snap.key, data: snap.val() })
  })

  // Write all uploaded service accounts to service account uploads subcollection
  await Promise.all(
    accountsByProject.map(({ projectId, data }) => {
      const projectRef = admin
        .firestore()
        .collection('projects')
        .doc(projectId)
      return Promise.all(
        map(data, (serviceAccount, serviceAccountId) => {
          return Promise.all([
            projectRef
              .collection('serviceAccountUploads')
              .doc(serviceAccountId)
              .set(pick(serviceAccount, ['createdAt', 'fullPath', 'name']))
          ])
        })
      )
    })
  )
  console.log('Service accounts copied from RTDB to accounts subcollection')

  // Add credential to each service account that is missing it
  const projectsSnap = await admin
    .firestore()
    .collection('projects')
    .get()
  const projectsSnaps = []
  projectsSnap.forEach(projectSnap => {
    projectsSnaps.push(projectSnap)
  })
  console.log('projects snaps:', projectsSnaps.length)
  await Promise.all(
    projectsSnaps.map(async projectSnap => {
      console.log('getting environments for project:', projectSnap.id)
      const environmentsSnap = await projectSnap
        .collection('environments')
        .get()
      const environmentsSnaps = []
      environmentsSnap.forEach(projectSnap => {
        environmentsSnaps.push(projectSnap)
      })
      return Promise.all(environmentsSnaps.map(handleServiceAccountCreate))
    })
  )
  console.log('Service accounts migrated successfully')
}
