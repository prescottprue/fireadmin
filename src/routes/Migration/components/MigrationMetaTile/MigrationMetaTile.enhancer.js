import { get, map, first } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers, withHandlers } from 'recompose'
import { withFirebase } from 'react-redux-firebase'

export default compose(
  withFirebase,
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
  connect(({ firebase: { data } }) => ({
    serviceAccounts: data.serviceAccounts
  })),
  withHandlers({
    runMigration: ({
      firebase,
      toInstance,
      fromInstance,
      instances,
      params,
      serviceAccounts
    }) => () => {
      const instance = get(instances, `${toInstance}`)
      const serviceAccount = first(
        map(get(instance, 'serviceAccounts'), (_, key) =>
          get(serviceAccounts, `${params.projectId}.${key}`)
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
