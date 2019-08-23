import * as admin from 'firebase-admin'
import { map } from 'lodash'
import { to } from 'utils/async'
import {
  PROJECTS_COLLECTION,
  PROJECTS_ENVIRONMENTS_COLLECTION
} from '@fireadmin/core/lib/constants/firestorePaths'
import { dataArrayFromSnap } from 'utils/firestore'

export async function getProjectByName(projectName) {
  console.log('get project with name:', projectName)
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
  const [firstProject] = dataArrayFromSnap(projectsSnap)
  if (!firstProject) {
    console.error(`Project with name "${projectName}" not found`)
    throw new Error('Project not found')
  }
  return firstProject
}

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
  const environmentsWithoutCredentials = map(
    dataArrayFromSnap(environmentsSnap),
    environment => {
      return {
        id: environment.id,
        name: environment.data.name
      }
    }
  )
  return environmentsWithoutCredentials
}
