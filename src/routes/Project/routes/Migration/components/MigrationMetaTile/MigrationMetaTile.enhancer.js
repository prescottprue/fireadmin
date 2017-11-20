import { get } from 'lodash'
import { compose } from 'redux'
import { withStateHandlers, withHandlers, flattenProp } from 'recompose'
import { withNotifications } from 'modules/notification'
import { withFirestore } from 'react-redux-firebase'

export default compose(
  withFirestore,
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
  flattenProp('project'),
  withHandlers({
    runMigration: props => async () => {
      const {
        firebase,
        environments,
        toInstance,
        fromInstance,
        copyPath
      } = props
      const serviceAccount1 = get(
        environments,
        `${fromInstance}.serviceAccount`
      )
      const environment1 = get(environments, fromInstance)
      const serviceAccount2 = get(environments, `${toInstance}.serviceAccount`)
      const environment2 = get(environments, toInstance)
      if (!serviceAccount1 || !serviceAccount2) {
        return props.showError('Service Account Not found')
      }
      // TODO: Use when service accounts is a subcollection on environment instead of paramert
      // const serviceAccounts1Snap = await firebase.firestore()
      //   .doc(`project/${params.projectId}/environments/${fromInstance}`)
      //   .get()
      // const serviceAccounts2Snap = await firebase.firestore()
      //   .doc(`project/${params.projectId}/environments/${toInstance}`)
      //   .get()
      // if (!serviceAccounts1Snap.exists || !serviceAccounts2Snap.exists) {
      //   return props.showError('Service Account Not found')
      // }
      // console.log('serviceAccount1', serviceAccounts1Snap.data(), serviceAccounts2.data())
      return firebase.push('requests/migration', {
        copyPath: copyPath || 'instances',
        dataType: 'rtdb',
        serviceAccountType: 'storage',
        database1URL: environment1.databaseURL,
        database2URL: environment2.databaseURL,
        serviceAccount1Path: serviceAccount1.fullPath,
        serviceAccount2Path: serviceAccount2.fullPath
      })
    }
  })
)
