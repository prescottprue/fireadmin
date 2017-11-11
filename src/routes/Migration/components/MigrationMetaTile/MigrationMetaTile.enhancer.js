import { get, map, first } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers, withHandlers } from 'recompose'
import { withFirestore, firestoreConnect } from 'react-redux-firebase'

export default compose(
  withFirestore,
  withStateHandlers(
    ({ initialSelected = null }) => ({
      fromInstance: initialSelected,
      toInstance: initialSelected,
      selectedProjectKey: '',
      instances: null
    }),
    {
      selectFrom: ({ selectInstance }) => (e, ind, newSelected) => ({
        fromInstance: newSelected
      }),
      selectTo: ({ selectInstance }) => (e, ind, newSelected) => ({
        toInstance: newSelected
      }),
      selectProject: ({ selectInstance, projects }) => (e, newSelected) => {
        return {
          selectedProjectKey: e.target.value,
          instances: get(projects, `${e.target.value}.instances`)
        }
      }
    }
  ),
  firestoreConnect(({ selectedProjectKey }) => {
    return [{ collection: 'projects' }, { collection: 'serviceAccounts' }]
  }),
  connect(
    (
      { firebase: { data, auth }, firestore },
      { params, selectedProjectKey }
    ) => ({
      auth,
      projects: firestore.data.projects,
      serviceAccounts: firestore.data.serviceAccounts
    })
  ),
  withHandlers({
    runMigration: props => () => {
      const {
        firebase,
        toInstance,
        // fromInstance,
        instances,
        params,
        serviceAccounts
      } = props
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
