import { pick, get } from 'lodash'
import { reset } from 'redux-form'
import { formNames } from 'constants'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'

/**
 * Handler for adding an environment to a project. Called clicking create
 * within AddEnvironmentDialog.
 * @param  {Object} props - EnvironmentsPage Component props
 * @return {Promise} Resolves after environment has been added and
 * success message has been displayed to user
 */
export const addEnvironment = props => async newProjectData => {
  const {
    firestore,
    firebase,
    params: { projectId },
    uid
  } = props
  const locationConf = {
    collection: 'projects',
    doc: projectId,
    subcollections: [{ collection: 'environments' }]
  }
  // Show error if service account is not selected (not part of form)
  if (!newProjectData.serviceAccount) {
    return props.showError('Please select a service account')
  }

  try {
    const serviceAccountRes = await firebase.uploadFile(
      `serviceAccounts/${projectId}/${Date.now()}`,
      newProjectData.serviceAccount
    )
    const { downloadURL, ref } = get(
      serviceAccountRes,
      'uploadTaskSnapshot',
      {}
    )
    // Build new environment object
    const newEnv = {
      ...newProjectData,
      serviceAccount: {
        downloadURL,
        fullPath: ref.fullPath
      },
      projectId,
      createdBy: uid,
      createdAt: firestore.FieldValue.serverTimestamp()
    }
    // Write new environment to firestore
    const newEnvironmentRes = await firestore.add(locationConf, newEnv)
    // Add service account to service accounts collection
    await firestore.add(
      {
        collection: 'projects',
        doc: projectId,
        subcollections: [
          { collection: 'environments', doc: newEnvironmentRes.id },
          { collection: 'serviceAccounts' }
        ]
      },
      {
        downloadURL,
        fullPath: ref.fullPath
      }
    )
    // Write event to project events
    await createProjectEvent(
      { projectId, firestore },
      {
        eventType: 'addEnvironment',
        eventData: { newEventId: newEnvironmentRes.id },
        createdBy: uid
      }
    )
    // Write event to Google Analytics
    triggerAnalyticsEvent({ category: 'Project', action: 'Add Environment' })
    // Reset form for future use
    props.dispatch(reset(formNames.newEnvironment))
    // Unselect selected service account
    props.clearServiceAccount()
    // Close AddEnvironmentDialog
    props.toggleDialog()
    // Show success snackbar
    props.showSuccess('Environment added successfully')
  } catch (err) {
    console.error('error', err) // eslint-disable-line no-console
    triggerAnalyticsEvent({
      category: 'Project',
      action: 'Error - Add Environment'
    })
    props.showError('Error: ', err.message || 'Could not add project')
  }
}

/**
 * Handler for removing environment from project. Called when hitting delete.
 * @param  {Object} props - EnvironmentsPage Component props
 * @return {Promise} Resolves after environment has been removed and
 * success message has been displayed to user
 */
export const removeEnvironment = props => async environmentId => {
  const {
    firestore,
    showError,
    showSuccess,
    uid,
    params: { projectId }
  } = props
  try {
    await firestore.delete({
      collection: 'projects',
      doc: projectId,
      subcollections: [{ collection: 'environments', doc: environmentId }]
    })
    await createProjectEvent(
      { firestore, projectId },
      {
        eventType: 'removeEnvironment',
        eventData: { environmentId },
        createdBy: uid
      }
    )
    triggerAnalyticsEvent({ category: 'Project', action: 'Remove Environment' })
    showSuccess('Environment deleted successfully')
  } catch (err) {
    console.error('error', err) // eslint-disable-line no-console
    triggerAnalyticsEvent({
      category: 'Project',
      action: 'Error - Remove Environment'
    })
    showError('Error: ', err.message || 'Could not remove environment')
  }
}

/**
 * Handler for updating environment with changes. Called when hitting save
 * in Add/Edit Environment Dialog.
 * @param  {Object} props - EnvironmentsPage Component props
 * @return {Promise} Resolves after environment has been updated and
 * success message has been displayed to user
 */
export const updateEnvironment = props => async newValues => {
  const {
    firestore,
    params: { projectId },
    uid,
    selectedKey
  } = props
  try {
    await props.firestore.update(
      {
        collection: 'projects',
        doc: projectId,
        subcollections: [{ collection: 'environments', doc: selectedKey }]
      },
      newValues
    )
    props.toggleDialog()
    props.showSuccess('Environment updated successfully')
    await createProjectEvent(
      { firestore, projectId },
      {
        eventType: 'updateEnvironment',
        eventData: { newValues },
        createdBy: uid
      }
    )
    triggerAnalyticsEvent({ category: 'Project', action: 'Update Environment' })
  } catch (err) {
    console.error('error', err) // eslint-disable-line no-console
    props.showError('Error: ', err.message || 'Could not update environment')
  }
}

/**
 * Handler for uploading service account. Called when uploading within
 * Add Environment Dialog.
 * @param  {Object} props - EnvironmentsPage Component props
 * @return {Promise} Resolves after service account has been uploaded and
 * success message has been displayed to user
 */
export const uploadServiceAccount = props => async files => {
  const {
    firebase,
    firestore,
    showSuccess,
    uid,
    params: { projectId }
  } = props
  const filePath = `serviceAccounts/${uid}/${projectId}`
  const res = await firebase.uploadFile(
    filePath,
    files[0],
    `projects/${projectId}/serviceAccountUploads`,
    {
      metadataFactory: (uploadTaskSnapshot, firebase, originalMeta) =>
        pick(originalMeta, ['name', 'createdAt', 'fullPath'])
    }
  )
  // Select newly uploaded service account within list
  props.selectServiceAccount(res.id)
  // Track event within project events
  await createProjectEvent(
    { firestore, projectId },
    {
      eventType: 'uploadAccount',
      createdBy: uid
    }
  )
  triggerAnalyticsEvent({
    category: 'Project',
    action: 'Upload Service Account'
  })
  showSuccess('Service Account uploaded successfully')
}
