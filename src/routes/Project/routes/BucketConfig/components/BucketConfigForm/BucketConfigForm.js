import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui-next/Button'
import IconButton from 'material-ui-next/IconButton'
import Paper from 'material-ui-next/Paper'
import DeleteIcon from 'material-ui-icons/Delete'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import classes from './BucketConfigForm.scss'

const renderCorsList = ({ fields, meta: { error, submitFailed } }) => (
  <div>
    <div className={classes.add}>
      <Button raised color="primary" onClick={() => fields.push({})}>
        Add CORS Config
      </Button>
      {submitFailed && error && <span>{error}</span>}
    </div>
    {fields.map((member, index) => (
      <Paper key={index} className={classes.item}>
        <IconButton onClick={() => fields.remove(index)}>
          <DeleteIcon />
        </IconButton>
        <h4>Config #{index + 1}</h4>
        <div className="flex-column">
          <Field
            name={`${member}.origin`}
            type="text"
            component={TextField}
            floatingLabelText="Origin"
          />
          <Field
            name={`${member}.method`}
            type="text"
            component={TextField}
            floatingLabelText="Method"
          />
          <Field
            name={`${member}.maxAgeSeconds`}
            type="number"
            component={TextField}
            floatingLabelText="Max Age Seconds"
          />
        </div>
      </Paper>
    ))}
  </div>
)

renderCorsList.propTypes = {
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired
}

export const BucketConfigForm = ({
  handleSubmit,
  pristine,
  reset,
  submitting
}) => (
  <form onSubmit={handleSubmit}>
    <FieldArray name="cors" component={renderCorsList} />
    <div>
      <Button
        raised
        color="primary"
        type="submit"
        disabled={submitting}
        style={{ marginRight: '1rem' }}>
        Update Bucket Config
      </Button>
      <Button
        raised
        color="accent"
        disabled={pristine || submitting}
        onClick={reset}>
        Clear Values
      </Button>
    </div>
  </form>
)

BucketConfigForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired
}

export default reduxForm({ form: 'bucketConfig' })(BucketConfigForm)
