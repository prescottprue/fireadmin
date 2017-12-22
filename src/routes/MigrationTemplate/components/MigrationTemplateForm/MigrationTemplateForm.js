import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Button from 'material-ui-next/Button'
import classes from './MigrationTemplateForm.scss'

export const MigrationTemplateForm = ({
  submitting,
  pristine,
  reset,
  handleSubmit
}) => (
  <form className={classes.container} onSubmit={handleSubmit}>
    <Field
      name="description"
      component={TextField}
      floatingLabelText="Description"
    />
    <Field
      name="tags"
      component={TextField}
      disabled
      floatingLabelText="Tags (seperated by commas)"
    />
    <div className={classes.buttons}>
      <Button
        disabled={pristine || submitting}
        color="accent"
        onTouchTap={reset}>
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
    </div>
  </form>
)

MigrationTemplateForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired
}

export default MigrationTemplateForm
