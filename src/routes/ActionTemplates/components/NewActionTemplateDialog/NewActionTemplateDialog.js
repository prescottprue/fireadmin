import React from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Button from '@material-ui/core/Button'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import styles from './NewActionTemplateDialog.styles'

const useStyles = makeStyles(styles)

function NewActionTemplateDialog({ onRequestClose, onSubmit, open }) {
  const classes = useStyles()
  const {
    register,
    handleSubmit,
    errors,
    formState: { dirty, isSubmitting }
  } = useForm()

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle>New Action Template</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className={classes.content}>
          <TextField
            name="name"
            label="Name"
            margin="normal"
            inputRef={register}
            fullWidth
          />
          <FormControlLabel
            control={<Switch name="public" inputRef={register} />}
            label="Public"
          />
          <TextField
            name="description"
            label="Description"
            fullWidth
            inputRef={register({
              maxLength: 500
            })}
            error={!!errors.description}
            helperText={errors.description && 'Email must be valid'}
          />
          <TextField
            name="tags"
            label="Tags (seperated by commas)"
            fullWidth
            inputRef={register}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isSubmitting}
            color="secondary"
            onClick={onRequestClose}>
            Cancel
          </Button>
          <Button
            disabled={isSubmitting || !dirty}
            color="primary"
            type="submit"
            className={classes.submit}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

NewActionTemplateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired
}

export default NewActionTemplateDialog
