import { get } from 'lodash'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { withStateHandlers, withHandlers, flattenProp } from 'recompose'
import { withFirebase } from 'react-redux-firebase'
import { firebasePaths } from 'constants'

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
    onSubmit: ({ firebase, toInstance, environments }) => data => {
      const environment = get(environments, toInstance, {})
      return firebase.push(firebasePaths.actionRunnerRequests, {
        databaseURL: environment.databaseURL,
        copyPath: data.path || 'instances',
        serviceAccount: get(environment, 'serviceAccount.fullPath')
      })
    }
  }),
  reduxForm({
    form: 'action'
  })
)
