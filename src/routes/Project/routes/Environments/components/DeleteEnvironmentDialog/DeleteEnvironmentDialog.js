import React from 'react'
import PropTypes from 'prop-types'
import Dialog, {
  DialogTitle,
  DialogActions,
  DialogContent
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import classes from './DeleteEnvironmentDialog.scss'

export const DeleteEnvironmentDialog = ({ onSubmit, onRequestClose, open }) => (
  <Dialog onClose={onRequestClose} open={open}>
    <DialogTitle id="dialog-title">Delete Environment</DialogTitle>
    <DialogContent className={classes.body}>
      <div className={classes.inputs}>
        Are you sure you want to delete this environment
      </div>
    </DialogContent>
    <DialogActions>
      <Button color="secondary" onClick={onRequestClose}>
        Cancel
      </Button>
      <Button color="primary" onClick={onSubmit}>
        Delete
      </Button>
    </DialogActions>
  </Dialog>
)

DeleteEnvironmentDialog.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default DeleteEnvironmentDialog
