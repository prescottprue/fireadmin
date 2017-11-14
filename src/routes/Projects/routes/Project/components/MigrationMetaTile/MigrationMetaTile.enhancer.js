import { get, map, first } from 'lodash'
import { compose } from 'redux'
import { withStateHandlers, withHandlers, flattenProp } from 'recompose'
import { withFirebase } from 'react-redux-firebase'

export default compose(
  withFirebase,
  flattenProp('project'),
  withStateHandlers(
    ({ initialSelected = null }) => ({
      fromInstance: initialSelected,
      toInstance: initialSelected
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
  withHandlers({
    runMigration: ({
      firebase,
      toInstance,
      fromInstance,
      instances,
      params,
      serviceAccounts,
      project
    }) => () => {
      const instance = get(instances, toInstance)
      const serviceAccount = first(
        map(get(instance, 'serviceAccounts'), (_, key) =>
          get(serviceAccounts, `${key}`)
        )
      )
      return firebase.push('requests/migration', {
        databaseURL: instance.databaseURL,
        copyPath: 'instances',
        serviceAccount: serviceAccount.fullPath
      })
    }
  })
)
