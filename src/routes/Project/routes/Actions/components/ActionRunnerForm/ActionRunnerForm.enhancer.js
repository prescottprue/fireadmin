import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { withStateHandlers } from 'recompose'
import { formNames } from 'constants'

export default compose(
  withStateHandlers(
    ({ initialExpanded = true }) => ({
      inputsExpanded: true,
      stepsExpanded: true
    }),
    {
      toggleInputs: ({ inputsExpanded }) => () => ({
        inputsExpanded: !inputsExpanded
      }),
      toggleSteps: ({ stepsExpanded }) => () => ({
        stepsExpanded: !stepsExpanded
      })
    }
  ),
  reduxForm({
    form: formNames.actionRunner
  })
)
