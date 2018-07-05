import React from 'react'
import PropTypes from 'prop-types'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import classes from './DeleteMemberModal.scss'

export const DeleteMemberModal = ({
  onRequestClose,
  removeDisabled,
  removeAndClose,
  name,
  open
}) => (
  <Dialog onClose={onRequestClose} open={open}>
    <DialogTitle id="dialog-title">Delete Member</DialogTitle>
    <DialogContent className={classes.body}>
      Are you sure you want to remove {name}?
    </DialogContent>
    <DialogActions>
      <Button color="secondary" onClick={onRequestClose}>
        Cancel
      </Button>
      <Button
        color="primary"
        disabled={removeDisabled}
        onClick={removeAndClose}>
        Remove
      </Button>
    </DialogActions>
  </Dialog>
)

DeleteMemberModal.propTypes = {
  removeDisabled: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
  name: PropTypes.string,
  open: PropTypes.bool.isRequired, // captured in other
  removeAndClose: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default DeleteMemberModal
