/* eslint-disable react/no-unused-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { required } from 'utils/form'

import classes from './NewProjectDialog.scss'

export const NewProjectDialog = ({
  open,
  onRequestClose,
  handleSubmit,
  pristine,
  reset,
  submitting,
  submit,
  closeAndReset
}) => (
  <Dialog open={open} onClose={onRequestClose} fullWidth maxWidth="xs">
    <DialogTitle id="new-title">New Project</DialogTitle>
    <DialogContent>
      <form onSubmit={handleSubmit} className={classes.inputs}>
        <Field
          name="name"
          component={TextField}
          label="Project Name"
          validate={[required]}
        />
      </form>
    </DialogContent>
    <DialogActions>
      <Button color="secondary" disabled={submitting} onClick={closeAndReset}>
        Cancel
      </Button>
      <Button
        color="primary"
        disabled={pristine || submitting}
        onClick={submit}>
        Create
      </Button>
    </DialogActions>
  </Dialog>
)

NewProjectDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  closeAndReset: PropTypes.func.isRequired, // added by enhancer (withHandlers)
  handleSubmit: PropTypes.func.isRequired, // added by redux-form
  pristine: PropTypes.bool.isRequired, // added by redux-form
  reset: PropTypes.func.isRequired, // added by redux-form
  submitting: PropTypes.bool.isRequired, // added by redux-form
  submit: PropTypes.func.isRequired // added by redux-form
}

export default NewProjectDialog
