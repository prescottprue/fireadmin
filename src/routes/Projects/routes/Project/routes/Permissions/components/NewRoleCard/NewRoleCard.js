import React from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import styles from './NewRoleCard.styles'

const useStyles = makeStyles(styles)

function NewRoleCard({ onSubmit, onRequestClose }) {
  const classes = useStyles()
  const {
    register,
    handleSubmit,
    formState: { isValid }
  } = useForm({
    mode: 'onChange'
  })

  return (
    <Paper className={classes.root} elevation={1}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h5">New Role</Typography>
        <TextField
          name="name"
          label="New Role Name"
          margin="normal"
          inputRef={register({
            required: true
          })}
          fullWidth
        />
        <div className={classes.buttons}>
          <Button
            color="secondary"
            aria-label="Run Action"
            onClick={onRequestClose}
            style={{ marginRight: '2rem' }}>
            Cancel
          </Button>
          <Button
            disabled={!isValid}
            color="primary"
            variant="contained"
            aria-label="Run Action"
            type="submit">
            Add New Role
          </Button>
        </div>
      </form>
    </Paper>
  )
}

NewRoleCard.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired
}

export default NewRoleCard
