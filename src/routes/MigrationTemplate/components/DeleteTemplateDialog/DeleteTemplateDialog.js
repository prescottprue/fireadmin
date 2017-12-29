import React from 'react'
import PropTypes from 'prop-types'
import Dialog, { DialogTitle } from 'material-ui-next/Dialog'
import Button from 'material-ui-next/Button'
// import classes from './DeleteTemplateDialog.scss'

export const DeleteTemplateDialog = ({ onClose, onDeleteClick, ...other }) => (
  <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" {...other}>
    <DialogTitle id="simple-dialog-title">Delete Template</DialogTitle>
    <Button onClick={onDeleteClick}>Delete Template</Button>
  </Dialog>
)

DeleteTemplateDialog.propTypes = {
  onClose: PropTypes.func,
  onDeleteClick: PropTypes.func
}

export default DeleteTemplateDialog
