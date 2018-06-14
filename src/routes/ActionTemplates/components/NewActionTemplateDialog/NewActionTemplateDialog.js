import React from 'react'
import PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import NewActionTemplateForm from '../NewActionTemplateForm'
import classes from './NewActionTemplateDialog.scss'

export const NewActionTemplateDialog = ({
  onRequestClose,
  handleSubmit,
  submitting,
  pristine,
  open
}) => (
  <Dialog open={open} onClose={onRequestClose}>
    <DialogTitle>New Action Template</DialogTitle>
    <form className={classes.container} onSubmit={handleSubmit}>
      <DialogContent className={classes.content}>
        <NewActionTemplateForm />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={submitting}
          color="secondary"
          onClick={onRequestClose}>
          Cancel
        </Button>
        <Button
          disabled={submitting || pristine}
          color="primary"
          type="submit"
          className={classes.submit}>
          Save
        </Button>
      </DialogActions>
    </form>
  </Dialog>
)

NewActionTemplateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired
}

export default NewActionTemplateDialog
