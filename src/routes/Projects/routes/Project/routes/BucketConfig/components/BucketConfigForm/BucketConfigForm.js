import React from 'react'
import PropTypes from 'prop-types'
import { get, map, pick } from 'lodash'
import { useForm, Controller, FormContext } from 'react-hook-form'
import {
  useFirestore,
  useDatabase,
  useFirestoreCollectionData,
  useUser
} from 'reactfire'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { databaseURLToProjectName } from 'utils'
import useNotifications from 'modules/notification/useNotifications'
import { waitForCompleted } from 'utils/firebaseFunctions'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'
import CorsList from '../CorsList'
import styles from './BucketConfigForm.styles'

const useStyles = makeStyles(styles)

function BucketConfigForm({ projectId }) {
  const classes = useStyles()
  const methods = useForm({
    defaultValues: { body: { cors: [{ origin: ['*'] }] } }
  })
  const database = useDatabase()
  const firestore = useFirestore()
  const { FieldValue } = useFirestore
  const user = useUser()
  const { showError, showSuccess } = useNotifications()
  const {
    control,
    watch,
    reset,
    setValue,
    formState: { isSubmitting, dirty }
  } = methods
  const environmentId = watch('environment')
  const body = watch('body')
  const method = watch('method')
  const environmentsRef = firestore.collection(
    `${PROJECTS_COLLECTION}/${projectId}/environments`
  )
  const projectEnvironments = useFirestoreCollectionData(environmentsRef, {
    idField: 'id'
  })
  const projectEnvironmentsById = projectEnvironments.reduce(
    (acc, projectEnvironment) => {
      return {
        ...acc,
        [projectEnvironment.id]: projectEnvironment
      }
    },
    {}
  )
  const environment = projectEnvironmentsById[environmentId]
  const databaseURL = get(environment, 'databaseURL')
  const databaseName = databaseURL && databaseURLToProjectName(databaseURL)
  const storageBucket = databaseName && `${databaseName}.appspot.com`

  async function sendBucketConfigRequest(bucketConfig) {
    try {
      // Push request to callGoogleApi cloud function
      const pushRef = await database.ref('requests/callGoogleApi').push({
        api: 'storage',
        ...pick(bucketConfig, ['method', 'cors', 'environment']),
        createdBy: user.uid,
        projectId,
        databaseName,
        databaseURL,
        storageBucket
      })
      const pushKey = pushRef.key
      // wait for response (written by cloud function)
      const results = await waitForCompleted(
        database.ref(`responses/callGoogleApi/${pushKey}`)
      )
      // Handle error calling google api (written to response)
      if (results.error) {
        console.error('Error in results', results.error) // eslint-disable-line no-console
        showError(`Error calling Google api: ${results.error}`)
        return null
      }
      if (bucketConfig.method === 'GET') {
        if (!get(results, 'responseData.cors')) {
          showSuccess('No CORS config currently exists for this bucket')
        } else {
          // Set config
          const { cors } = results.responseData
          setValue('body.cors', cors)
          showSuccess('Storage Bucket Config Get Successful')
        }
      } else {
        showSuccess(
          `Storage Bucket ${
            bucketConfig.method || 'UPDATE'
          } completed Successfully`
        )
      }
      // Set config
      triggerAnalyticsEvent('bucketAction', {
        method: bucketConfig.method || 'GET',
        resource: 'CORS'
      })
      await createProjectEvent(
        { firestore, projectId, FieldValue },
        {
          eventType: `${
            bucketConfig.method ? bucketConfig.method.toLowerCase() : 'get'
          }BucketConfig`,
          eventData: { bucketConfig },
          createdBy: user.uid
        }
      )
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
                  defaultValue="GET"
                />
              </FormControl>
            </Grid>
            {storageBucket ? (
              <Grid item xs={12} md={8}>
                <Typography variant="h6">Storage Bucket</Typography>
                <Typography>{storageBucket}</Typography>
              </Grid>
            ) : null}
          </Grid>
        </Paper>
        <Paper className={classes.paper}>
          <Typography className={classes.subHeader} variant="h5">
            CORS Configuration
          </Typography>
          <CorsList name="body.cors" />
        </Paper>
      </form>
    </FormContext>
  )
}

BucketConfigForm.propTypes = {
  projectId: PropTypes.string.isRequired
}

export default BucketConfigForm
