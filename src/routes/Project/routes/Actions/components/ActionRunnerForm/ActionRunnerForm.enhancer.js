import { get } from 'lodash'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { withStateHandlers } from 'recompose'
import { formNames } from 'constants'
import { connect } from 'react-redux'

export default compose(
  connect(({ firestore: { data, ordered } }, { projectId }) => ({
    project: get(data, `projects.${projectId}`),
    environments: get(ordered, `environments-${projectId}`)
  })),
  withStateHandlers(
    ({ initialExpanded = true }) => ({
      inputsExpanded: true,
      stepsExpanded: true,
      environmentsExpanded: true,
      selectedTab: 0
    }),
    {
      toggleInputs: ({ inputsExpanded }) => () => ({
        inputsExpanded: !inputsExpanded
      }),
      toggleEnvironments: ({ environmentsExpanded }) => () => ({
        environmentsExpanded: !environmentsExpanded
      }),
      toggleSteps: ({ stepsExpanded }) => () => ({
        stepsExpanded: !stepsExpanded
      }),
      selectTab: () => (e, selectedTab) => ({
        selectedTab
      })
    }
  ),
  reduxForm({
    form: formNames.actionRunner,
    enableReinitialize: true
  })
)
