import { get, invoke } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers, withHandlers } from 'recompose'
import { withNotifications } from 'modules/notification'
import { firebaseConnect, firestoreConnect, getVal } from 'react-redux-firebase'

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
  withStateHandlers(
    ({ initialSelected = null }) => ({
      fromInstance: initialSelected,
      toInstance: initialSelected,
      copyPath: null,
      instances: null
    }),
    {
      selectFrom: ({ selectInstance }) => (e, ind, newSelected) => ({
        fromInstance: newSelected
      }),
      selectTo: ({ selectInstance }) => (e, ind, newSelected) => ({
        toInstance: newSelected
      }),
      setCopyPath: ({ copyPath }) => e => ({
        copyPath: e.target.value
      }),
      setConfig: () => currentConfig => ({
        currentConfig
      })
    }
  ),
  withHandlers({
    updateBucketConfig: ({
      firebase,
      showSuccess,
      showError
    }) => async bucketConfig => {
      try {
        const pushRef = await firebase.pushWithMeta('requests/googleApi', {
          api: 'storage',
          method: 'PUT',
          ...bucketConfig
        })
        await waitForCompleted(pushRef, firebase)
        showSuccess('Stoage Bucket Config Updated Successfully')
      } catch (err) {
        showError('Error Updating Storage Bucket Config')
        throw err
      }
    },
    getBucketConfig: ({
      firebase,
      showSuccess,
      showError,
      setConfig
    }) => async bucketConfig => {
      try {
        const pushRef = await firebase.pushWithMeta('requests/googleApi', {
          api: 'storage',
          method: 'GET',
          suffix: `b/${bucketConfig.project}.appspot.com`
        })
        const results = await waitForCompleted(pushRef, firebase)
        setConfig(results)
        showSuccess('Stoage Bucket Config Get Successful')
      } catch (err) {
        showError('Error Updating Storage Bucket Config')
        throw err
      }
    }
  })
)
