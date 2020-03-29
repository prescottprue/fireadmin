import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { map } from 'lodash'
import MenuItem from '@material-ui/core/MenuItem'
import { Field, FieldArray } from 'redux-form'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from 'components/FormSelectField'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import CorsList from '../CorsList'

function BucketConfigForm({
  classes,
  handleSubmit,
  pristine,
  serviceAccount,
  storageBucket,
  method,
  reset,
  projectEnvironments,
  currentConfig,
  body,
  submitting
}) {
  return (
    <form onSubmit={handleSubmit} className={classes.container}>
      <div className={classes.buttons}>
        <Button
          color="primary"
          type="submit"
          variant="contained"
          disabled={pristine || submitting || (method === 'PUT' && !body)}
          className={classes.button}>
          Run Bucket Action
        </Button>
        <Button
          color="secondary"
          variant="contained"
          disabled={pristine || submitting}
          onClick={reset}>
          Cancel
        </Button>
      </div>
      <Paper className={classes.paper}>
        <Grid container spacing={8} justify="center">
          <Grid item xs={12} md={8}>
            <FormControl className={classes.formItem}>
              <InputLabel htmlFor="environment">Environment</InputLabel>
              <Field
                name="environment"
                component={Select}
                fullWidth
                inputProps={{
                  name: 'environment',
                  id: 'environment'
                }}>
                {map(projectEnvironments, ({ id, name, fullPath }, i) => (
                  <MenuItem key={`Environment-${id}-${i}`} value={id}>
                    {name}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={8}>
            <FormControl className={classes.formItem}>
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
          </Grid>
          <Grid item xs={12} md={8}>
            <FormControl disabled className={classes.formItem}>
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
          </Grid>
        </Grid>
      </Paper>
      <Paper className={classes.paper}>
        <Typography className={classes.subHeader} variant="h5">
          CORS Configuration
        </Typography>
        <FieldArray
          name="body.cors"
          component={(props) => <CorsList {...props} />}
        />
      </Paper>
    </form>
  )
}

BucketConfigForm.propTypes = {
  body: PropTypes.object,
  method: PropTypes.string,
  projectEnvironments: PropTypes.array,
  currentConfig: PropTypes.object,
  serviceAccount: PropTypes.object,
  storageBucket: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  reset: PropTypes.func.isRequired // from enhancer (reduxForm)
}

export default BucketConfigForm
