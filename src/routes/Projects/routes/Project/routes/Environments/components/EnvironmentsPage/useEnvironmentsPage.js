import { useState } from 'react'
import {
  useFirestore,
  useUser,
  useFirestoreCollectionData,
  useStorage
} from 'reactfire'
import useNotifications from 'modules/notification/useNotifications'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'
import { to } from 'utils/async'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'

export default function useEnvironmentsPage({ projectId }) {
  const { showError, showSuccess } = useNotifications()

  // State
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

  // Data
  const firestore = useFirestore()
  const storage = useStorage()
  const { FieldValue } = useFirestore
  const user = useUser()
  const environmentsRef = firestore.collection(
    `${PROJECTS_COLLECTION}/${projectId}/environments`
  )
  const projectEnvironments = useFirestoreCollectionData(environmentsRef, {
    idField: 'id'
  })

  // Handlers
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
    const { ref } = serviceAccountRes
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
      firestore
        .collection(`${PROJECTS_COLLECTION}/${projectId}/environments`)
        .add(newEnv)
    )

    // Handle errors creating environment
    if (newEnvErr) {
      console.error('Error creating environment', newEnvErr) // eslint-disable-line no-console
      showError('Error creating new environment: ', newEnvErr.message)
      throw newEnvErr
    }
    // Write event to project events
    await createProjectEvent(
      { projectId, firestore, FieldValue },
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
        .doc(
          `${PROJECTS_COLLECTION}/${projectId}/environments/${selectedDeleteKey}`
        )
        .delete()
      await createProjectEvent(
        { firestore, projectId, FieldValue },
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
        .doc(`${PROJECTS_COLLECTION}/${projectId}/environments/${selectedKey}`)
        .update(newValues)
      toggleEditDialog()
      showSuccess('Environment updated successfully')
      await createProjectEvent(
        { firestore, projectId, FieldValue },
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
      console.error('Error updating environment:', err.message) // eslint-disable-line no-console
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
