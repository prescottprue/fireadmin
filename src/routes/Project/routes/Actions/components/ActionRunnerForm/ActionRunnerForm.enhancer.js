import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { withStateHandlers } from 'recompose'
import { withNotifications } from 'modules/notification'
import { formNames } from 'constants'

export default compose(
  withNotifications,
  withStateHandlers(
    ({ initialExpanded = true }) => ({
      templateEditExpanded: true,
      inputsExpanded: true,
      stepsExpanded: true,
      actionProcessing: false,
      copyPath: null
    }),
    {
      toggleTemplateEdit: ({ templateEditExpanded }) => () => ({
        templateEditExpanded: !templateEditExpanded
      }),
      toggleInputs: ({ inputsExpanded }) => () => ({
        inputsExpanded: !inputsExpanded
      }),
      toggleSteps: ({ stepsExpanded }) => () => ({
        stepsExpanded: !stepsExpanded
      }),
      toggleActionProcessing: ({ actionProcessing }) => e => ({
        actionProcessing: !actionProcessing
      })
    }
  ),
  reduxForm({
    form: formNames.actionRunner
  })
)
