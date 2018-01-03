import React from 'react'
import PropTypes from 'prop-types'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui-next/Dialog'
import NewMigrationTemplateForm from '../NewMigrationTemplateForm'
import Button from 'material-ui-next/Button'
import classes from './NewMigrationTemplateDialog.scss'

export const NewMigrationTemplateDialog = ({
  onRequestClose,
  handleSubmit,
  submitting,
  pristine,
  open
}) => (
  <Dialog open={open} onClose={onRequestClose} className={classes.container}>
    <DialogTitle>New Migration Template</DialogTitle>
    <form className={classes.container} onSubmit={handleSubmit}>
      <DialogContent className={classes.content}>
        <NewMigrationTemplateForm />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={submitting}
          color="accent"
          onTouchTap={onRequestClose}>
          Cancel
        </Button>
        <Button
          raised
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

NewMigrationTemplateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired
}

export default NewMigrationTemplateDialog
