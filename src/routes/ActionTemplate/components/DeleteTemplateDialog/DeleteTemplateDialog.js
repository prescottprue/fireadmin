import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import classes from './DeleteTemplateDialog.scss'

export const DeleteTemplateDialog = ({
  onClose,
  onDeleteClick,
  open,
  templateName
}) => (
  <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
    <DialogTitle id="dialog-title">Delete Template</DialogTitle>
    <DialogContent className={classes.body}>
      <div className={classes.inputs}>
        Are you sure you want to delete {templateName || 'Template'}?
      </div>
    </DialogContent>
    <DialogActions>
      <Button onClick={onDeleteClick}>Delete Template</Button>
    </DialogActions>
  </Dialog>
)

DeleteTemplateDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  templateName: PropTypes.string
}

export default DeleteTemplateDialog
