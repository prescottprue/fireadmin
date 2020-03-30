import { invoke, get } from 'lodash'
import { triggerAnalyticsEvent } from 'utils/analytics'

export function saveCollaborators({
  firestore,
  firebase,
  uid,
  project,
  showError,
  onRequestClose,
  selectedCollaborators,
  showSuccess
}) {
  return async (newInstance) => {
    const currentProject = await firestore.get(`projects/${project.id}`)
    const projectData = invoke(currentProject, 'data')
    const collaborators = get(projectData, 'collaborators', {})
    const permissions = get(projectData, 'permissions', {})
    selectedCollaborators.forEach((currentCollaborator) => {
      if (!get(projectData, `collaborators.${currentCollaborator.objectID}`)) {
        collaborators[currentCollaborator.objectID] = true
        permissions[currentCollaborator.objectID] = {
          permission: 'viewer',
          role: 'viewer',
          sharedAt: firestore.FieldValue.serverTimestamp()
        }
      }
    })
    try {
      await firestore
        .doc(`projects/${project.id}`)
        .update({ collaborators, permissions })
      onRequestClose()
      showSuccess('Collaborator added successfully')
      triggerAnalyticsEvent('addCollaborator', { projectId: project.id })
    } catch (err) {
      showError('Collaborator could not be added')
      throw err
    }
  }
}

export function closeAndReset({ onRequestClose, reset }) {
  return () => {
    onRequestClose()
    reset()
  }
}
