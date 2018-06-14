import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers, withHandlers, setPropTypes } from 'recompose'
import { reduxForm, formValueSelector } from 'redux-form'
import { formNames } from 'constants'

const selector = formValueSelector(formNames.newEnvironment)

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
      dropFiles: ({ droppedFiles, selectedServiceAccountInd }) => files => {
        const newDroppedFiles = droppedFiles.concat(files)
        return {
          droppedFiles: newDroppedFiles, // add newly dropped files to existing
          selectedServiceAccountInd:
            selectedServiceAccountInd ||
            (newDroppedFiles.length && newDroppedFiles.length - 1) // fallback to last of dropped files (handling 0)
        }
      }
    }
  ),
  reduxForm({
    form: formNames.newEnvironment
  }),
  connect(state => {
    return {
      formValues: selector(state, 'databaseURL', 'name', 'description')
    }
  }),
  setPropTypes({
    reset: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  }),
  withHandlers({
    closeAndReset: ({ reset, onRequestClose }) => () => {
      reset()
      onRequestClose && onRequestClose()
    },
    callSubmit: ({
      onSubmit,
      droppedFiles,
      formValues,
      selectedServiceAccountInd
    }) => () => {
      onSubmit({
        ...formValues,
        serviceAccount: droppedFiles[selectedServiceAccountInd]
      })
    }
  })
)
