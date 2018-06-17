import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { required } from 'utils/form'
import classes from './NewMemberModal.scss'

export const NewMemberModal = ({
  callSubmit,
  handleSubmit,
  submitting,
  projectId,
  pristine,
  onRequestClose,
  closeAndReset,
  open
}) => (
  <Dialog onClose={onRequestClose} open={open}>
    <DialogTitle id="dialog-title">Add Member</DialogTitle>
    <DialogContent className={classes.body}>
      <form className={classes.inputs} onSubmit={handleSubmit}>
        <Field
          component={TextField}
          className={classes.field}
          name="name"
          validate={required}
          fullWidth
          label="Member Name"
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
        onClick={callSubmit}>
        Add Member
      </Button>
    </DialogActions>
  </Dialog>
)

NewMemberModal.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  callSubmit: PropTypes.func.isRequired,
  projectId: PropTypes.string,
  open: PropTypes.bool.isRequired, // captured in other
  closeAndReset: PropTypes.func.isRequired, // from enhancer (withHandlers)
  submitting: PropTypes.bool.isRequired, // from reduxForm
  pristine: PropTypes.bool.isRequired // from reduxForm
}

export default NewMemberModal
