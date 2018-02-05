import React from 'react'
import PropTypes from 'prop-types'
import Dialog, { DialogTitle } from 'material-ui/Dialog'
import Button from 'material-ui/Button'
// import classes from './DeleteTemplateDialog.scss'

export const DeleteTemplateDialog = ({ onClose, onDeleteClick, open }) => (
  <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
    <DialogTitle id="simple-dialog-title">Delete Template</DialogTitle>
    <Button onClick={onDeleteClick}>Delete Template</Button>
  </Dialog>
)

DeleteTemplateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default DeleteTemplateDialog
