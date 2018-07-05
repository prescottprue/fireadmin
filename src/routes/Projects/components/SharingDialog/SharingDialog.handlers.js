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
  return async newInstance => {
    const currentProject = await firestore.get(`projects/${project.id}`)
    const projectData = invoke(currentProject, 'data')
    const collaborators = get(projectData, 'collaborators', {})
    const collaboratorPermissions = get(
      projectData,
      'collaboratorPermissions',
      {}
    )
    selectedCollaborators.forEach(currentCollaborator => {
      if (!get(projectData, `collaborators.${currentCollaborator.objectID}`)) {
        collaborators[currentCollaborator.objectID] = true
        collaboratorPermissions[currentCollaborator.objectID] = {
          permission: 'viewer',
          sharedAt: Date.now()
        }
      }
    })
    try {
      await firebase
        .firestore()
        .doc(`projects/${project.id}`)
        .update({ collaborators, collaboratorPermissions })
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
