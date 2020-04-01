import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { get, map } from 'lodash'
import MenuItem from '@material-ui/core/MenuItem'
import {
  useFormContext,
  useForm,
  Controller,
  FormContext
} from 'react-hook-form'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from 'components/FormSelectField'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { databaseURLToProjectName } from 'utils'
// import CorsList from '../CorsList'
import styles from './BucketConfigForm.styles'

const useStyles = makeStyles(styles)

function BucketConfigForm({
  onSubmit,
  projectEnvironmentsById,
  projectEnvironments,
  currentConfig
}) {
  const classes = useStyles()
  const methods = useForm({ defaultValues: currentConfig })
  const {
    control,
    watch,
    reset,
    formState: { isSubmitting, dirty }
  } = useFormContext()
  const environment = watch('environment')
  const body = watch('body')
  const method = watch('method')

  const databaseURL = get(projectEnvironmentsById, `${environment}.databaseURL`)
  const databaseName = databaseURL && databaseURLToProjectName(databaseURL)
  const storageBucket = databaseName && `${databaseName}.appspot.com`
  return (
    <FormContext {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={classes.container}>
        <div className={classes.buttons}>
          <Button
            color="primary"
            type="submit"
            variant="contained"
            disabled={!dirty || isSubmitting || (method === 'PUT' && !body)}
            className={classes.button}>
            Run Bucket Action
          </Button>
          <Button
            color="secondary"
            variant="contained"
            disabled={!dirty || isSubmitting}
            onClick={reset}>
            Cancel
          </Button>
        </div>
        <Paper className={classes.paper}>
          <Grid container spacing={8} justify="center">
            <Grid item xs={12} md={8}>
              <FormControl className={classes.formItem}>
                <InputLabel htmlFor="environment">Environment</InputLabel>
                <Controller
                  as={
                    <Select fullWidth>
                      {map(projectEnvironments, ({ id, name, fullPath }, i) => (
                        <MenuItem key={`Environment-${id}-${i}`} value={id}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="environment"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl className={classes.formItem}>
                <InputLabel htmlFor="method">Method</InputLabel>
                <Controller
                  as={
                    <Select fullWidth>
                      <MenuItem value="GET">Get Config</MenuItem>
                      <MenuItem value="PUT">Update Config</MenuItem>
                    </Select>
                  }
                  name="method"
                  placeholder="Action"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={8}>
              <FormControl disabled className={classes.formItem}>
                <InputLabel htmlFor="bucket">
                  {storageBucket || 'Storage Bucket (defaults to app bucket)'}
                </InputLabel>
                <Controller
                  as={
                    <Select fullWidth>
                      <MenuItem value="empty">empty</MenuItem>
                    </Select>
                  }
                  name="bucket"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <Typography className={classes.subHeader} variant="h5">
            CORS Configuration
          </Typography>
          {/* <FieldArray
          name="body.cors"
          component={(props) => <CorsList {...props} />}
        /> */}
        </Paper>
      </form>
    </FormContext>
  )
}

BucketConfigForm.propTypes = {
  projectEnvironments: PropTypes.array,
  currentConfig: PropTypes.object,
  storageBucket: PropTypes.string,
  onSubmit: PropTypes.func.isRequired
}

export default BucketConfigForm
