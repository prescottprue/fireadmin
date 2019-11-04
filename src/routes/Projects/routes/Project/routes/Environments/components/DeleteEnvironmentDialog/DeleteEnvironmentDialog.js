import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'

function DeleteEnvironmentDialog({ onSubmit, onRequestClose, open }) {
  return (
    <Dialog onClose={onRequestClose} open={open}>
      <DialogTitle id="dialog-title">Delete Environment</DialogTitle>
      <DialogContent>
        <div>Are you sure you want to delete this environment</div>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          onClick={onRequestClose}
          data-test="environment-delete-cancel">
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onSubmit}
          data-test="environment-delete-submit">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

DeleteEnvironmentDialog.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default DeleteEnvironmentDialog
