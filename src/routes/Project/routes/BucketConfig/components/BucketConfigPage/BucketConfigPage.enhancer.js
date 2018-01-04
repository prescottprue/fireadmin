import { get, invoke } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers } from 'recompose'
import { firebaseConnect, firestoreConnect, getVal } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'

const waitForCompleted = (ref, firebase) => {
  return new Promise((resolve, reject) => {
    const requestKey = ref.key
    firebase.ref(`responses/googleApi/${requestKey}`).on(
      'value',
      snap => {
        const snapVal = invoke(snap, 'val')
        if (get(snapVal, 'completed') === true) {
          resolve(snap)
        }
      },
      err => reject(err)
    )
  })
}

export default compose(
  firebaseConnect(({ params }) => [`serviceAccounts/${params.projectId}`]),
  firestoreConnect(({ params }) => [
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'environments' }]
    },
    {
      collection: 'projects',
      doc: params.projectId
    }
  ]),
  connect(({ firebase, firestore: { data } }, { params }) => ({
    project: get(data, `projects.${params.projectId}`),
    serviceAccounts: getVal(
      firebase,
      `data/serviceAccounts/${params.projectId}`
    )
  })),
  withNotifications,
  withHandlers({
    callGoogleApi: ({
      firebase,
      showSuccess,
      showError
    }) => async bucketConfig => {
      try {
        const pushRef = await firebase.pushWithMeta('requests/googleApi', {
          api: 'storage',
          ...bucketConfig
        })
        await waitForCompleted(pushRef, firebase)
        showSuccess('Storage Bucket Config Updated Successfully')
      } catch (err) {
        showError('Error Updating Storage Bucket Config')
        throw err
      }
    }
  })
)
