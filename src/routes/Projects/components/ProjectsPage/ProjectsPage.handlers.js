import { LIST_PATH } from 'constants/paths'
import defaultRoles from 'constants/defaultRoles'
import { triggerAnalyticsEvent } from 'utils/analytics'

/**
 * Handler for adding a project
 * @param {Object} props - component props
 */
export function addProject(props) {
  return async (newInstance) => {
    const { firestore, firebase, uid, showError } = props
    if (!uid) {
      return showError('You must be logged in to create a project')
    }
    try {
      props.toggleDialog()
      const res = await firestore.add(
        { collection: 'projects' },
        {
          ...newInstance,
          createdBy: uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          permissions: {
            [uid]: {
              role: 'owner',
              updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }
          },
          roles: defaultRoles
        }
      )
      props.showSuccess('Project added successfully')
      triggerAnalyticsEvent('createProject')
      return res
    } catch (err) {
      showError(err.message || 'Could not add project')
      throw err
    }
  }
}

/**
 * Handler for deleting a project
 * @param {Object} props - component props
 */
export function deleteProject(props) {
  return async (projectId) => {
    const { firestore, showError, showSuccess } = props
    try {
      await firestore.delete({ collection: 'projects', doc: projectId })
      showSuccess('Project deleted successfully')
      triggerAnalyticsEvent('deleteProject', { projectId })
    } catch (err) {
      console.error('Error deleting project:', err) // eslint-disable-line no-console
      showError(err.message || 'Error deleting project')
    }
  }
}

/**
 * Handler for navigating to a project
 * @param {Object} props - component props
 */
export function goToProject({ history }) {
  return (projectId) => {
    history.push(`${LIST_PATH}/${projectId}`)
  }
}
