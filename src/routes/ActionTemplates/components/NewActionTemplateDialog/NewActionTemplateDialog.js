import React from 'react'
import PropTypes from 'prop-types'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import NewActionTemplateForm from '../NewActionTemplateForm'
import Button from 'material-ui/Button'
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
