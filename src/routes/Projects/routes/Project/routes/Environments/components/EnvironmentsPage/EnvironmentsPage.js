import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  useFirestore,
  useUser,
  useFirestoreCollectionData,
  useStorage
} from 'reactfire'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import useNotifications from 'modules/notification/useNotifications'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'
import { to } from 'utils/async'
import Instance from '../Instance'
import AddEnvironmentDialog from '../AddEnvironmentDialog'
import EditEnvironmentDialog from '../EditEnvironmentDialog'
import DeleteEnvironmentDialog from '../DeleteEnvironmentDialog'
import styles from './EnvironmentsPage.styles'

const useStyles = makeStyles(styles)

function useEnvironmentsPage({ projectId }) {
  const { showError, showSuccess } = useNotifications()
  const [newDialogOpen, changeNewDialogOpen] = useState(false)
  const [editDialogOpen, changeEditDialogOpen] = useState(false)
  const [deleteDialogOpen, changeDeleteDialogOpen] = useState(false)
  const [selectedServiceAccount, changeSelectedServiceAccount] = useState(null)
  const [selectedInstance, changeSelectedInstance] = useState(null)
  const [selectedKey, changeSelectedKey] = useState(null)
  const [selectedDeleteKey, changeSelectedDeleteKey] = useState(null)
  const toggleNewDialog = () => changeNewDialogOpen(!newDialogOpen)
  const toggleEditDialog = (action, key) => {
    changeEditDialogOpen(!editDialogOpen)
    changeSelectedInstance(editDialogOpen ? null : action)
    changeSelectedKey(editDialogOpen ? null : key)
  }
  const toggleDeleteDialog = (key) => {
    changeDeleteDialogOpen(!deleteDialogOpen)
    changeSelectedDeleteKey(deleteDialogOpen ? null : key)
  }
  const selectServiceAccount = (pickedAccount) => {
    changeSelectedServiceAccount(
      selectedServiceAccount === pickedAccount ? null : pickedAccount
    )
  }
  const clearServiceAccount = () => changeSelectedServiceAccount(null)

  const firestore = useFirestore()
  const storage = useStorage()
  const { FieldValue } = useFirestore
  const user = useUser()
  const environmentsRef = firestore.collection(
    `projects/${projectId}/environments`
  )
  const projectEnvironments = useFirestoreCollectionData(environmentsRef, {
    idField: 'id'
  })

  /**
   * Handler for adding an environment to a project. Called clicking create
   * within AddEnvironmentDialog.
   * @param  {Object} props - EnvironmentsPage Component props
   * @return {Promise} Resolves after environment has been added and
   * success message has been displayed to user
   */
  async function addEnvironment(newProjectData) {
    // Show error if service account is not selected (not part of form)
    if (!newProjectData.serviceAccount) {
      return showError('Please select a service account')
    }

    // Upload service account
    const [uploadErr, serviceAccountRes] = await to(
      storage
        .ref(`serviceAccounts/${user.uid}/${projectId}/${Date.now()}`)
        .put(newProjectData.serviceAccount)
    )
    if (uploadErr) {
      console.error('error', uploadErr) // eslint-disable-line no-console
      showError(
        'Error uploading service account: ',
        uploadErr.message || 'Could not add project'
      )
      throw uploadErr
    }
    const { ref } = serviceAccountRes && serviceAccountRes.uploadTaskSnapshot
    // Build new environment object
    const newEnv = {
      ...newProjectData,
      serviceAccount: {
        fullPath: ref.fullPath
      },
      projectId,
      createdBy: user.uid,
      createdAt: FieldValue.serverTimestamp()
    }
    // Unselect selected service account
    clearServiceAccount()
    // Close AddEnvironmentDialog
    toggleNewDialog()
    // Show success snackbar
    showSuccess('Environment added successfully')

    // Write new environment to project
    const [newEnvErr, newEnvironmentRes] = await to(
      firestore.doc(`projects/${projectId}/environments`).add(newEnv)
    )

    // Handle errors creating environment
    if (newEnvErr) {
      console.error('Error creating environment', newEnvErr) // eslint-disable-line no-console
      showError('Error creating new environment: ', newEnvErr.message)
      throw newEnvErr
    }
    // Write event to project events
    await createProjectEvent(
      { projectId, firestore },
      {
        eventType: 'createEnvironment',
        eventData: { newEnvironmentId: newEnvironmentRes.id },
        createdBy: user.uid
      }
    )
    // Write event to Analytics
    triggerAnalyticsEvent('createEnvironment', {
      projectId,
      newEnvironmentId: newEnvironmentRes.id
    })
  }

  /**
   * Handler for removing environment from project. Called when hitting delete.
   * @param {Object} props - EnvironmentsPage Component props
   * @returns {Promise} Resolves after environment has been removed and
   * success message has been displayed to user
   */
  async function removeEnvironment() {
    try {
      await firestore
        .doc(`projects/${projectId}/environments/${selectedDeleteKey}`)
        .delete()
      await createProjectEvent(
        { firestore, projectId },
        {
          eventType: 'deleteEnvironment',
          eventData: { environmentId: selectedDeleteKey },
          createdBy: user.uid
        }
      )
      triggerAnalyticsEvent('deleteEnvironment', {
        projectId,
        environmentId: selectedDeleteKey
      })
      toggleDeleteDialog()
      showSuccess('Environment deleted successfully')
    } catch (err) {
      console.error('error', err) // eslint-disable-line no-console
      showError('Error: ', err.message || 'Could not remove environment')
    }
  }

  /**
   * Handler for updating environment with changes. Called when hitting save
   * in Add/Edit Environment Dialog.
   * @param {Object} props - EnvironmentsPage Component props
   * @returns {Promise} Resolves after environment has been updated and
   * success message has been displayed to user
   */
  async function updateEnvironment(newValues) {
    try {
      await firestore
        .doc(`projects/${projectId}/environments/${selectedDeleteKey}`)
        .update(newValues)
      toggleEditDialog()
      showSuccess('Environment updated successfully')
      await createProjectEvent(
        { firestore, projectId },
        {
          eventType: 'updateEnvironment',
          eventData: { newValues },
          createdBy: user.uid
        }
      )
      triggerAnalyticsEvent('updateEnvironment', {
        projectId,
        uid: user.uid,
        environmentId: selectedKey
      })
    } catch (err) {
      console.error('error', err) // eslint-disable-line no-console
      showError('Error: ', err.message || 'Could not update environment')
    }
  }

  return {
    toggleNewDialog,
    toggleDeleteDialog,
    toggleEditDialog,
    selectServiceAccount,
    selectedInstance,
    projectEnvironments,
    newDialogOpen,
    deleteDialogOpen,
    editDialogOpen,
    addEnvironment,
    selectedServiceAccount,
    updateEnvironment,
    removeEnvironment
  }
}

function EnvironmentsPage({ projectId }) {
  const classes = useStyles()
  const {
    toggleNewDialog,
    toggleDeleteDialog,
    toggleEditDialog,
    selectServiceAccount,
    selectedInstance,
    projectEnvironments,
    newDialogOpen,
    deleteDialogOpen,
    editDialogOpen,
    addEnvironment,
    selectedServiceAccount,
    updateEnvironment,
    removeEnvironment
  } = useEnvironmentsPage({ projectId })

  return (
    <div>
      <Typography className={classes.pageHeader}>Environments</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={toggleNewDialog}
        style={{ marginBottom: '2rem' }}
        data-test="add-environment-button">
        Add Environment
      </Button>
      <div>
        {projectEnvironments && projectEnvironments.length ? (
          <div className="flex-column">
            <div className={classes.instances}>
              {projectEnvironments.map((inst, i) => (
                <Instance
                  key={`Instance-${inst.id}-${i}`}
                  instance={inst}
                  instanceId={inst.id}
                  onEditClick={() => toggleEditDialog(inst, inst.id)}
                  onRemoveClick={() => toggleDeleteDialog(inst.id)}
                  data-test="environment-tile"
                />
              ))}
            </div>
          </div>
        ) : (
          <Paper className={classes.paper} data-test="no-environments-message">
            <Typography className={classes.paragraph}>
              An environment is a Firebase project for a specific phase of your
              project (such as "development" or "production"). Multiple
              environments allow for testing code in a "sandbox" before
              releasing it to the world. Most Real World Production applications
              leverage many environment.
            </Typography>
            <Typography className={classes.paragraph}>
              Create an environment within your project by clicking the "Add
              Environment" button above
            </Typography>
          </Paper>
        )}
      </div>
      <DeleteEnvironmentDialog
        open={deleteDialogOpen}
        projectId={projectId}
        onSubmit={removeEnvironment}
        onRequestClose={toggleDeleteDialog}
      />
      <AddEnvironmentDialog
        open={newDialogOpen}
        projectId={projectId}
        onSubmit={addEnvironment}
        onRequestClose={toggleNewDialog}
        selectedServiceAccount={selectedServiceAccount}
        onAccountClick={selectServiceAccount}
      />
      <EditEnvironmentDialog
        selectedInstance={selectedInstance}
        open={editDialogOpen}
        projectId={projectId}
        initialValues={selectedInstance}
        onSubmit={updateEnvironment}
        onRequestClose={toggleEditDialog}
        onAccountClick={selectServiceAccount}
      />
    </div>
  )
}

EnvironmentsPage.propTypes = {
  projectId: PropTypes.string.isRequired
}

export default EnvironmentsPage
