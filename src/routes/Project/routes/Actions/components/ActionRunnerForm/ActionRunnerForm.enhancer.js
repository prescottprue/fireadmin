import { get } from 'lodash'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { withStateHandlers } from 'recompose'
import { ACTION_RUNNER_FORM_NAME } from 'constants/formNames'
import { connect } from 'react-redux'

export default compose(
  connect(({ firestore: { data, ordered } }, { projectId }) => ({
    project: get(data, `projects.${projectId}`),
    environments: get(ordered, `environments-${projectId}`)
  })),
  withStateHandlers(
    ({ initialExpanded = true }) => ({
      selectedTab: 0
    }),
    {
      selectTab: () => (e, selectedTab) => ({
        selectedTab
      })
    }
  ),
  reduxForm({
    form: ACTION_RUNNER_FORM_NAME,
    enableReinitialize: true
  })
)
