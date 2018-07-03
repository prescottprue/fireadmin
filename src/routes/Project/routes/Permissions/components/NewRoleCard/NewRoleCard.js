import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

export const NewRoleCard = ({
  handleSubmit,
  pristine,
  closeAndReset,
  classes
}) => (
  <Paper className={classes.root} elevation={1}>
    <form onSubmit={handleSubmit}>
      <Typography variant="headline" component="h3">
        New Role
      </Typography>
      <Field
        component={TextField}
        className={classes.field}
        name="name"
        fullWidth
        label="New Role Name"
      />
      <div className={classes.buttons}>
        <Button
          color="secondary"
          aria-label="Run Action"
          onClick={closeAndReset}
          style={{ marginRight: '2rem' }}>
          Cancel
        </Button>
        <Button
          disabled={pristine}
          color="primary"
          variant="raised"
          aria-label="Run Action"
          type="submit">
          Add New Role
        </Button>
      </div>
    </form>
  </Paper>
)

NewRoleCard.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  closeAndReset: PropTypes.func.isRequired
}

export default NewRoleCard
