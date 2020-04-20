import React from 'react'
import PropTypes from 'prop-types'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import styles from './DeleteMemberModal.styles'

const useStyles = makeStyles(styles)

function DeleteMemberModal({
  onRequestClose,
  removeDisabled,
  onDeleteClick,
  name,
  uid,
  open
}) {
  const classes = useStyles()

  function removeAndClose() {
    onRequestClose && onRequestClose()
    onDeleteClick && onDeleteClick(uid || name)
  }

  return (
    <Dialog onClose={onRequestClose} open={open}>
      <DialogTitle id="dialog-title">
        Delete {uid ? 'Member' : 'Role'}
      </DialogTitle>
      <DialogContent className={classes.body}>
        Are you sure you want to remove {name} {uid ? `(${uid})` : null}?
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onRequestClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          disabled={removeDisabled}
          onClick={removeAndClose}
          data-test="delete-submit">
          Remove
        </Button>
      </DialogActions>
    </Dialog>
  )
}

DeleteMemberModal.propTypes = {
  removeDisabled: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  name: PropTypes.string,
  uid: PropTypes.string,
  open: PropTypes.bool.isRequired
}

export default DeleteMemberModal
