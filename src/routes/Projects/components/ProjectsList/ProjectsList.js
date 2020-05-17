import React from 'react'
import { uniqBy } from 'lodash'
import {
  useFirestore,
  useUser,
  useFirestoreCollection,
  useFirestoreCollectionData
} from 'reactfire'
import useNotifications from 'modules/notification/useNotifications'
import { triggerAnalyticsEvent } from 'utils/analytics'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'
import ProjectTile from '../ProjectTile'
import { withErrorBoundary } from 'utils/components'
import LoadingSpinner from 'components/LoadingSpinner'

function ProjectsList() {
  const { showError, showSuccess } = useNotifications()
  const firestore = useFirestore()
  const user = useUser()
  const projectsRef = firestore.collection(PROJECTS_COLLECTION)
  const currentUsersProjectsRef = projectsRef.where('createdBy', '==', user.uid)
  const collabProjectsRef = projectsRef.where(
    `collaborators.${user.uid}`,
    '==',
    true
  )
  const currentUserProjectsSnap = useFirestoreCollection(
    currentUsersProjectsRef
  )
  const currentUsersProjects = useFirestoreCollectionData(
    currentUsersProjectsRef,
    { idField: 'id' }
  )
  const collabProjectsSnap = useFirestoreCollection(collabProjectsRef)
  const collabProjects = useFirestoreCollectionData(collabProjectsRef, {
    idField: 'id'
  })
  const projects = uniqBy(currentUsersProjects.concat(collabProjects), 'id')

  /**
   * Handler for deleting a project
   */
  async function deleteProject(projectId) {
    try {
      await firestore.doc(`${PROJECTS_COLLECTION}/${projectId}`).delete()
      showSuccess('Project deleted successfully')
      triggerAnalyticsEvent('deleteProject', { projectId })
    } catch (err) {
      console.error('Error deleting project:', err) // eslint-disable-line no-console
      showError(err.message || 'Error deleting project')
    }
  }

  if (
    currentUserProjectsSnap.metadata.fromCache ||
    collabProjectsSnap.metadata.fromCache
  ) {
    return <LoadingSpinner />
  }

  return (
    <>
      {projects.map((project, ind) => {
        return (
          <ProjectTile
            key={`Project-${project.id}-${ind}`}
            name={project.name}
            project={project}
            projectId={project.id}
            onDelete={() => deleteProject(project.id)}
          />
        )
      })}
    </>
  )
}

export default withErrorBoundary()(ProjectsList)
