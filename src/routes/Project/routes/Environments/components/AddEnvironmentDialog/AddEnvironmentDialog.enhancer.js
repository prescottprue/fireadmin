import { compose } from 'redux'
import { withStateHandlers, withHandlers } from 'recompose'
import { reduxForm } from 'redux-form'
import { formNames } from 'constants'

export default compose(
  withStateHandlers(
    () => ({
      droppedFiles: [],
      selectedServiceAccountInd: null
    }),
    {
      selectServiceAccount: ({ selectedServiceAccountInd }) => pickInd => ({
        selectedServiceAccountInd:
          selectedServiceAccountInd === pickInd ? null : pickInd
      }),
      clearServiceAccount: () => () => ({
        selectedServiceAccountInd: null
      }),
      dropFiles: ({ droppedFiles }) => files => ({
        droppedFiles: droppedFiles.concat(files)
      })
    }
  ),
  reduxForm({
    form: formNames.newEnvironment
  }),
  withHandlers({
    closeAndReset: ({ reset, onRequestClose }) => () => {
      reset()
      onRequestClose && onRequestClose()
    }
  })
)
