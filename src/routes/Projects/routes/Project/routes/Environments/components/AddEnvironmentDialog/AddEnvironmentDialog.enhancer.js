import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers, withHandlers, setPropTypes } from 'recompose'
import { reduxForm, formValueSelector } from 'redux-form'
import { NEW_ENVIRONMENT_FORM_NAME } from 'constants/formNames'

const selector = formValueSelector(NEW_ENVIRONMENT_FORM_NAME)

export default compose(
  withStateHandlers(
    () => ({
      droppedFiles: [],
      selectedServiceAccountInd: null
    }),
    {
      selectServiceAccount: ({ selectedServiceAccountInd }) => (pickInd) => ({
        selectedServiceAccountInd:
          selectedServiceAccountInd === pickInd ? null : pickInd
      }),
      clearServiceAccount: () => () => ({
        selectedServiceAccountInd: null
      }),
      dropFiles: ({ droppedFiles, selectedServiceAccountInd }) => (files) => {
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
    form: NEW_ENVIRONMENT_FORM_NAME
  }),
  connect((state) => {
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
