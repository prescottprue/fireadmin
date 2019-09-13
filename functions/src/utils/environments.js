import * as admin from 'firebase-admin'
import { map, pick } from 'lodash'
import { to } from 'utils/async'
import {
  PROJECTS_COLLECTION,
  PROJECTS_ENVIRONMENTS_COLLECTION
} from '@fireadmin/core/lib/constants/firestorePaths'

/**
 * Get project by the name of the project
 * @param {string} projectName - Name of project to get
 */
export async function getProjectByName(projectName) {
  const [getProjectErr, projectsSnap] = await to(
    admin
      .firestore()
      .collection(PROJECTS_COLLECTION)
      .where('name', '==', projectName)
      .get()
  )

  if (getProjectErr) {
    console.error(
      `Error getting project with name "${projectName}"`,
      getProjectErr
    )
    throw getProjectErr
  }

  const [firstProject] = projectsSnap.docs

  if (!firstProject) {
    console.error(`Project with name "${projectName}" not found`)
    throw new Error('Project not found')
  }

  return firstProject
}

/**
 * Get environments for a specified project reference
 * @param {admin.firestore.DocumentReference} projectRef - Reference of project to get
 */
export async function getEnvironmentsFromProjectRef(projectRef) {
  // Get environments of found project
  const [getEnvironmentsErr, environmentsSnap] = await to(
    projectRef.collection(PROJECTS_ENVIRONMENTS_COLLECTION).get()
  )

  if (getEnvironmentsErr) {
    console.error(
      `Error getting project environments for project with path "${
        projectRef.path
      }"`,
      getEnvironmentsErr
    )
    throw getEnvironmentsErr
  }

  return map(environmentsSnap.docs, environment =>
    pick(environment, ['id', 'name', 'databaseURL'])
  )
}
