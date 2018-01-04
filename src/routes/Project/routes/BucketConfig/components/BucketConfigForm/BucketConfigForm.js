import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui-next/Button'
import { map, get } from 'lodash'
import MenuItem from 'material-ui/MenuItem'
import { Field, FieldArray } from 'redux-form'
import { SelectField } from 'redux-form-material-ui'
import CorsList from '../CorsList'
import classes from './BucketConfigForm.scss'

export const BucketConfigForm = ({
  handleSubmit,
  pristine,
  serviceAccounts,
  serviceAccount,
  storageBucket,
  method,
  reset,
  project,
  currentConfig,
  body,
  submitting
}) => (
  <form onSubmit={handleSubmit} className={classes.container}>
    <div className={classes.buttons}>
      <Button
        raised
        color="primary"
        type="submit"
        disabled={
          pristine ||
          submitting ||
          !serviceAccount ||
          (method === 'PUT' && !body)
        }
        className={classes.button}>
        Run Bucket Action
      </Button>
      <Button
        raised
        color="accent"
        disabled={pristine || submitting}
        onClick={reset}>
        Clear Values
      </Button>
    </div>
    <div className={classes.field}>
      <Field
        name="method"
        component={SelectField}
        floatingLabelText={'Config Action'}
        fullWidth>
        <MenuItem value="GET" primaryText="Get Config" />
        <MenuItem value="PUT" primaryText="Update Config" />
      </Field>
    </div>
    <div className={classes.field}>
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
    <div className={classes.field}>
      <Field
        name="environment"
        component={SelectField}
        floatingLabelText="Environment"
        fullWidth>
        {map(get(project, 'environments'), ({ name, fullPath }, key) => (
          <MenuItem key={key} value={key} primaryText={name} />
        ))}
      </Field>
    </div>
    <div className={classes.field}>
      <Field
        name="bucket"
        disabled
        component={SelectField}
        floatingLabelText={
          storageBucket || 'Storage Bucket (defaults to app bucket)'
        }
        fullWidth>
        <MenuItem value="empty" primaryText="empty" />
      </Field>
    </div>

    <FieldArray name="body.cors" component={CorsList} />
  </form>
)

BucketConfigForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  reset: PropTypes.func.isRequired, // from enhancer (reduxForm)
  body: PropTypes.object,
  method: PropTypes.string,
  project: PropTypes.object,
  serviceAccounts: PropTypes.object,
  currentConfig: PropTypes.object,
  serviceAccount: PropTypes.object,
  storageBucket: PropTypes.string
}

export default BucketConfigForm
