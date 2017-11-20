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
      instances: null
    }),
    {
      selectFrom: ({ selectInstance }) => (e, ind, newSelected) => ({
        fromInstance: newSelected
      }),
      selectTo: ({ selectInstance }) => (e, ind, newSelected) => ({
        toInstance: newSelected
      })
    }
  ),
  flattenProp('project'),
  withHandlers({
    runMigration: props => () => {
      const { firebase, environments, toInstance, fromInstance } = props
      const serviceAccount1Path = get(
        environments,
        `${fromInstance}.serviceAccount.fullPath`,
        ''
      )
      const serviceAccount2Path = get(
        environments,
        `${toInstance}.serviceAccount.fullPath`
      )
      if (!serviceAccount1Path || !serviceAccount2Path) {
        return props.showError('Service Account Not found')
      }
      return firebase.push('requests/migration', {
        copyPath: 'instances',
        dataType: 'rtdb',
        serviceAccountType: 'storage',
        serviceAccount1Path,
        serviceAccount2Path
      })
    }
  })
)
