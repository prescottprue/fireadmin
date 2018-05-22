import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import { map, get } from 'lodash'
import { MenuItem } from 'material-ui/Menu'
import { Field, FieldArray } from 'redux-form'
import Typography from 'material-ui/Typography'
import { InputLabel } from 'material-ui/Input'
import { FormControl } from 'material-ui/Form'
import { Select } from 'redux-form-material-ui'
import Paper from 'material-ui/Paper'
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
        color="primary"
        type="submit"
        variant="raised"
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
        color="secondary"
        variant="raised"
        disabled={pristine || submitting}
        onClick={reset}>
        Cancel
      </Button>
    </div>
    <Paper className={classes.paper}>
      <FormControl className={classes.field}>
        <InputLabel htmlFor="environment">Environment</InputLabel>
        <Field
          name="environment"
          component={Select}
          fullWidth
          inputProps={{
            name: 'environment',
            id: 'environment'
          }}>
          {map(get(project, 'environments'), ({ name, fullPath }, i) => (
            <MenuItem key={`Environment-${i}-${name}`} value={i}>
              {name}
            </MenuItem>
          ))}
        </Field>
      </FormControl>
      <FormControl className={classes.field}>
        <InputLabel htmlFor="serviceAccount">Service Account</InputLabel>
        <Field
          name="serviceAccount.fullPath"
          component={Select}
          fullWidth
          inputProps={{
            name: 'serviceAccount',
            id: 'serviceAccount'
          }}>
          {map(serviceAccounts, ({ name, fullPath }, idx) => (
            <MenuItem key={`ServiceAccount-${idx}-${name}`} value={fullPath}>
              {name}
            </MenuItem>
          ))}
        </Field>
      </FormControl>
      <FormControl className={classes.field}>
        <InputLabel htmlFor="method">Method</InputLabel>
        <Field
          name="method"
          component={Select}
          placeholder="Action"
          fullWidth
          inputProps={{
            name: 'method',
            id: 'method'
          }}>
          <MenuItem value="GET">Get Config</MenuItem>
          <MenuItem value="PUT">Update Config</MenuItem>
        </Field>
      </FormControl>
      <FormControl className={classes.field} disabled>
        <InputLabel htmlFor="bucket">
          {storageBucket || 'Storage Bucket (defaults to app bucket)'}
        </InputLabel>
        <Field
          name="bucket"
          component={Select}
          fullWidth
          inputProps={{
            name: 'bucket',
            id: 'bucket'
          }}>
          <MenuItem value="empty">empty</MenuItem>
        </Field>
      </FormControl>
    </Paper>
    <Paper className={classes.paper}>
      <Typography
        className={classes.subHeader}
        variant="headline"
        component="h2">
        CORS Configuration
      </Typography>
      <FieldArray name="body.cors" component={CorsList} />
    </Paper>
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
  serviceAccounts: PropTypes.array,
  currentConfig: PropTypes.object,
  serviceAccount: PropTypes.object,
  storageBucket: PropTypes.string
}

export default BucketConfigForm
