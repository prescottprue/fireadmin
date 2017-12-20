import { get } from 'lodash'
import { compose } from 'redux'
import { withStateHandlers, withHandlers } from 'recompose'
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
  withHandlers({
    runMigration: props => async () => {
      const {
        firebase,
        params,
        project,
        toInstance,
        fromInstance,
        copyPath
      } = props
      const serviceAccount1 = get(
        project,
        `environments.${fromInstance}.serviceAccount`
      )
      const environment1 = get(project, `environments.${fromInstance}`)
      const serviceAccount2 = get(
        project,
        `environments.${toInstance}.serviceAccount`
      )
      const environment2 = get(project, `environments.${toInstance}`)
      // Show error notification if either service account is missing
      if (!serviceAccount1 || !serviceAccount2) {
        return props.showError('Service Account Not found')
      }
      return firebase.pushWithMeta('requests/migration', {
        copyPath: copyPath || 'instances',
        dataType: 'rtdb',
        projectId: get(params, 'projectId'),
        serviceAccountType: 'storage',
        database1URL: environment1.databaseURL,
        database2URL: environment2.databaseURL,
        serviceAccount1Path: serviceAccount1.fullPath,
        serviceAccount2Path: serviceAccount2.fullPath
      })
    }
  })
)
