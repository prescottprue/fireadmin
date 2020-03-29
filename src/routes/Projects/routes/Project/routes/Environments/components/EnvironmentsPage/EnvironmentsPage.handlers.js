import { get } from 'lodash'
import { reset } from 'redux-form'
import { NEW_ENVIRONMENT_FORM_NAME } from 'constants/formNames'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'
import { to } from 'utils/async'

/**
 * Handler for adding an environment to a project. Called clicking create
 * within AddEnvironmentDialog.
 * @param  {Object} props - EnvironmentsPage Component props
 * @return {Promise} Resolves after environment has been added and
 * success message has been displayed to user
 */
export const addEnvironment = (props) => async (newProjectData) => {
  const { firestore, firebase, projectId, uid } = props
  const locationConf = {
    collection: 'projects',
    doc: projectId,
    subcollections: [{ collection: 'environments' }]
  }
  // Show error if service account is not selected (not part of form)
  if (!newProjectData.serviceAccount) {
    return props.showError('Please select a service account')
  }

  // Upload service account
  const [uploadErr, serviceAccountRes] = await to(
    firebase.uploadFile(
      `serviceAccounts/${uid}/${projectId}/${Date.now()}`,
      newProjectData.serviceAccount
    )
  )
  if (uploadErr) {
    console.error('error', uploadErr) // eslint-disable-line no-console
    props.showError(
      'Error uploading service account: ',
      uploadErr.message || 'Could not add project'
    )
    throw uploadErr
  }
  const { ref } = get(serviceAccountRes, 'uploadTaskSnapshot', {})
  // Build new environment object
  const newEnv = {
    ...newProjectData,
    serviceAccount: {
      fullPath: ref.fullPath
    },
    projectId,
    createdBy: uid,
    createdAt: firestore.FieldValue.serverTimestamp()
  }
  // Reset form for future use
  props.dispatch(reset(NEW_ENVIRONMENT_FORM_NAME))
  // Unselect selected service account
  props.clearServiceAccount()
  // Close AddEnvironmentDialog
  props.toggleNewDialog()
  // Show success snackbar
  props.showSuccess('Environment added successfully')

  // Write new environment to project
  const [newEnvErr, newEnvironmentRes] = await to(
    firestore.add(locationConf, newEnv)
  )

  // Handle errors creating environment
  if (newEnvErr) {
    console.error('Error creating environment', newEnvErr) // eslint-disable-line no-console
    props.showError('Error creating new environment: ', newEnvErr.message)
    throw newEnvErr
  }
  // Write event to project events
  await createProjectEvent(
    { projectId, firestore },
    {
      eventType: 'createEnvironment',
      eventData: { newEnvironmentId: newEnvironmentRes.id },
      createdBy: uid
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
export const removeEnvironment = (props) => async () => {
  const {
    firestore,
    showError,
    showSuccess,
    uid,
    selectedDeleteKey,
    projectId
  } = props
  try {
    await firestore.delete({
      collection: 'projects',
      doc: projectId,
      subcollections: [{ collection: 'environments', doc: selectedDeleteKey }]
    })
    await createProjectEvent(
      { firestore, projectId },
      {
        eventType: 'deleteEnvironment',
        eventData: { environmentId: selectedDeleteKey },
        createdBy: uid
      }
    )
    triggerAnalyticsEvent('deleteEnvironment', {
      projectId,
      environmentId: selectedDeleteKey
    })
    props.toggleDeleteDialog()
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
export const updateEnvironment = (props) => async (newValues) => {
  const { firestore, projectId, uid, selectedKey } = props
  try {
    await firestore.update(
      {
        collection: 'projects',
        doc: projectId,
        subcollections: [{ collection: 'environments', doc: selectedKey }]
      },
      newValues
    )
    props.toggleEditDialog()
    props.showSuccess('Environment updated successfully')
    await createProjectEvent(
      { firestore, projectId },
      {
        eventType: 'updateEnvironment',
        eventData: { newValues },
        createdBy: uid
      }
    )
    triggerAnalyticsEvent('updateEnvironment', {
      projectId,
      uid,
      environmentId: selectedKey
    })
  } catch (err) {
    console.error('error', err) // eslint-disable-line no-console
    props.showError('Error: ', err.message || 'Could not update environment')
  }
}
