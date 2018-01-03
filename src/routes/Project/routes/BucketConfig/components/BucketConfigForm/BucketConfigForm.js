import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui-next/Button'
import IconButton from 'material-ui-next/IconButton'
import Paper from 'material-ui-next/Paper'
import { map } from 'lodash'
import { compose } from 'redux'
import MenuItem from 'material-ui/MenuItem'
import DeleteIcon from 'material-ui-icons/Delete'
import { Field, FieldArray, reduxForm, formValues } from 'redux-form'
import { TextField, SelectField } from 'redux-form-material-ui'
import classes from './BucketConfigForm.scss'

const methods = ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS']

const renderOriginsList = ({ fields, meta: { error, submitFailed } }) => (
  <div style={{ marginBottom: '1rem' }}>
    <div className={classes.add}>
      <Button raised color="primary" onClick={() => fields.push()}>
        Add Origin
      </Button>
      {submitFailed && error && <span>{error}</span>}
    </div>
    {fields.map((member, index) => (
      <div className="flex-row" key={`Origin-${index}`}>
        <Field
          name={member}
          type="text"
          component={TextField}
          floatingLabelText="Origin"
        />
        {index !== 0 && (
          <IconButton
            onClick={() => fields.remove(index)}
            style={{ marginTop: '1.5rem' }}>
            <DeleteIcon />
          </IconButton>
        )}
      </div>
    ))}
  </div>
)

renderOriginsList.propTypes = {
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired
}

const renderCorsList = ({ fields, meta: { error, submitFailed } }) => (
  <div>
    {fields.map((member, index) => (
      <Paper key={index} className={classes.item}>
        <div className="flex-row">
          <h4>CORS Config #{index + 1}</h4>
          <IconButton onClick={() => fields.remove(index)}>
            <DeleteIcon />
          </IconButton>
        </div>
        <div className="flex-column">
          <FieldArray name={`${member}.origin`} component={renderOriginsList} />
          <div className="flex-column">
            <Field
              name={`${member}.method`}
              component={SelectField}
              floatingLabelText="HTTP Methods to Include"
              multiple>
              {methods.map(name => (
                <MenuItem key={name} value={name} primaryText={name} />
              ))}
            </Field>
          </div>
          <Field
            name={`${member}.maxAgeSeconds`}
            type="number"
            component={TextField}
            floatingLabelText="Max Age (in seconds)"
          />
        </div>
      </Paper>
    ))}
    <div className={classes.add}>
      <Button
        raised
        color="primary"
        onClick={() => fields.push({ origin: [''] })}>
        Add CORS Config
      </Button>
      {submitFailed && error && <span>{error}</span>}
    </div>
  </div>
)

renderCorsList.propTypes = {
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired
}

export const BucketConfigForm = ({
  handleSubmit,
  pristine,
  serviceAccounts,
  serviceAccount,
  reset,
  submitting
}) => (
  <form onSubmit={handleSubmit}>
    <div>
      <Button
        raised
        color="primary"
        type="submit"
        disabled={pristine || submitting || !serviceAccount}
        style={{ marginRight: '1rem' }}>
        Get Bucket Config
      </Button>
      <Button
        raised
        color="primary"
        type="submit"
        disabled={pristine || submitting || !serviceAccount}
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
    <div style={{ marginLeft: '4rem', marginRight: '4rem' }}>
      <Field
        name="serviceAccount.fullPath"
        component={SelectField}
        floatingLabelText="Service Account"
        fullWidth>
        {map(serviceAccounts, ({ name, fullPath }) => (
          <MenuItem key={name} value={fullPath} primaryText={name} />
        ))}
      </Field>
    </div>
    <FieldArray name="body.cors" component={renderCorsList} />
  </form>
)

BucketConfigForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  serviceAccounts: PropTypes.object,
  serviceAccount: PropTypes.object
}

export default compose(
  reduxForm({
    form: 'bucketConfig',
    initialValues: { body: { cors: [{ origin: [''] }] } }
  }),
  formValues('serviceAccount')
)(BucketConfigForm)
