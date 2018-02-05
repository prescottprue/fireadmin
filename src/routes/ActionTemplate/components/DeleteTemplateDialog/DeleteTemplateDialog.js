import React from 'react'
import PropTypes from 'prop-types'
import Dialog, { DialogTitle, DialogActions } from 'material-ui/Dialog'
import Button from 'material-ui/Button'
// import classes from './DeleteTemplateDialog.scss'

export const DeleteTemplateDialog = ({ onClose, onDeleteClick, open }) => (
  <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
    <DialogTitle id="dialog-title">Delete Template</DialogTitle>
    <DialogActions>
      <Button onClick={onDeleteClick}>Delete Template</Button>
    </DialogActions>
  </Dialog>
)

DeleteTemplateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default DeleteTemplateDialog
