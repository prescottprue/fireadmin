import React from 'react'
import Button from '@material-ui/core/Button'
import { get, map, pick } from 'lodash'
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
import {
  useFirestore,
  useDatabase,
  useFirestoreCollectionData,
  useAuth
} from 'reactfire'
import useNotifications from 'modules/notification/useNotifications'
import { waitForCompleted } from 'utils/firebaseFunctions'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'

const useStyles = makeStyles(styles)

function BucketConfigForm({ projectId }) {
  const classes = useStyles()
  const methods = useForm({ defaultValues: { method: 'GET' } })
  const database = useDatabase()
  const firestore = useFirestore()
  const auth = useAuth()
  const { showError, showSuccess } = useNotifications()
  const {
    control,
    watch,
    reset,
    formState: { isSubmitting, dirty }
  } = useFormContext()
  const environment = watch('environment')
  const body = watch('body')
  const method = watch('method')
  const environmentsRef = firestore.collection(
    `projects/${projectId}/environments`
  )
  const projectEnvironments = useFirestoreCollectionData(environmentsRef)
  const projectEnvironmentsById = projectEnvironments.reduce(
    (acc, projectEnvironment) => {
      return {
        ...acc,
        [projectEnvironments.id]: projectEnvironment
      }
    },
    {}
  )
  const databaseURL = get(projectEnvironmentsById, `${environment}.databaseURL`)
  const databaseName = databaseURL && databaseURLToProjectName(databaseURL)
  const storageBucket = databaseName && `${databaseName}.appspot.com`

  async function sendBucketConfigRequest(bucketConfig) {
    try {
      const databaseURL = get(
        projectEnvironmentsById,
        `${bucketConfig.environment}.databaseURL`
      )
      // Push request to callGoogleApi cloud function
      const pushRef = await database.ref('requests/callGoogleApi').push({
        api: 'storage',
        ...pick(bucketConfig, ['method', 'cors', 'environment']),
        projectId,
        databaseName,
        databaseURL,
        storageBucket: `${databaseName}.appspot.com`
      })
      const pushKey = pushRef.key
      // wait for response (written by cloud function)
      const results = await waitForCompleted(
        database.ref(`responses/callGoogleApi/${pushKey}`)
      )
      // Handle error calling google api (written to response)
      if (results.error) {
        showError(`Error calling Google api: ${results.error}`)
        throw new Error(results.error)
      }
      if (bucketConfig.method === 'GET' && !get(results, 'responseData.cors')) {
        showSuccess('No CORS config currently exists for this bucket')
      } else {
        // Set config
        const { cors } = results.responseData
        methods.setValue([cors])
        showSuccess('Storage Bucket Config Get Successful')
        triggerAnalyticsEvent('bucketAction', {
          method: bucketConfig.method || 'GET',
          resource: 'CORS'
        })
        await createProjectEvent(
          { firestore, projectId },
          {
            eventType: `${
              bucketConfig.method ? bucketConfig.method.toLowerCase() : 'get'
            }BucketConfig`,
            eventData: { bucketConfig },
            createdBy: auth.currentUser.uid
          }
        )
        showSuccess(
          `Storage Bucket ${
            bucketConfig.method || 'UPDATE'
          } completed Successfully`
        )
      }
    } catch (err) {
      if (err.message.indexOf('access to') !== -1) {
        showError('Error: Service Account Does Not Have Access')
        throw new Error('Service Account does not have Access')
      }
      showError('Error Updating Storage Bucket Config')
      throw err
    }
  }

  return (
    <FormContext {...methods}>
      <form
        onSubmit={methods.handleSubmit(sendBucketConfigRequest)}
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

export default BucketConfigForm
