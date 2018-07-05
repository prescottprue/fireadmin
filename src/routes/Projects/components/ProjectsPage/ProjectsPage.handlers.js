import { LIST_PATH } from 'constants'
import { triggerAnalyticsEvent } from 'utils/analytics'

export const addProject = props => async newInstance => {
  const { firestore, firebase, uid, showError } = props
  if (!uid) {
    return showError('You must be logged in to create a project')
  }
  try {
    const res = await firestore.add(
      { collection: 'projects' },
      {
        ...newInstance,
        createdBy: uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }
    )
    props.showSuccess('Project added successfully')
    props.toggleDialog()
    triggerAnalyticsEvent('createProject')
    return res
  } catch (err) {
    showError(err.message || 'Could not add project')
    throw err
  }
}

export const deleteProject = props => async projectId => {
  const { firestore, showError, showSuccess } = props
  try {
    await firestore.delete({ collection: 'projects', doc: projectId })
    showSuccess('Project deleted successfully')
    triggerAnalyticsEvent('deleteProject', { projectId })
  } catch (err) {
    console.error('Error:', err) // eslint-disable-line no-console
    showError(err.message || 'Could not add project')
  }
}

export const goToProject = ({ router }) => projectId => {
  router.push(`${LIST_PATH}/${projectId}`)
}

export const goToCollaborator = ({ router, showError }) => userId => {
  showError('User pages are not yet supported!')
  // router.push(`${USERS_PATH}/${userId}`)
}
