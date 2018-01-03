import { get, invoke } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers, withHandlers } from 'recompose'
import { withNotifications } from 'modules/notification'
import { firebaseConnect, getVal } from 'react-redux-firebase'

const waitForCompleted = ref => {
  return new Promise((resolve, reject) => {
    ref.on(
      'value',
      snap => {
        const snapVal = invoke(snap, 'val')
        if (get(snapVal, 'complete') === true) {
          resolve(snap)
        }
        console.log('on fired without having complete true:', snapVal) // eslint-disable-line no-console
      },
      err => reject(err)
    )
  })
}

export default compose(
  firebaseConnect(({ params }) => [`serviceAccounts/${params.projectId}`]),
  connect(({ firebase, firestore: { data } }, { params }) => ({
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
          ...bucketConfig
        })
        await waitForCompleted(pushRef)
        showSuccess('Stoage Bucket Config Updated Successfully')
      } catch (err) {
        showError('Error Updating Storage Bucket Config')
        throw err
      }
    }
  })
)
