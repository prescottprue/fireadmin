import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useFirestore, useUser, useFirestoreCollectionData } from 'reactfire'
import { makeStyles } from '@material-ui/core/styles'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import ProjectRoute from 'routes/Projects/routes/Project'
import { renderChildren } from 'utils/router'
import useNotifications from 'modules/notification/useNotifications'
import { triggerAnalyticsEvent } from 'utils/analytics'
import defaultRoles from 'constants/defaultRoles'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'
import ProjectTile from '../ProjectTile'
import NewProjectTile from '../NewProjectTile'
import NewProjectDialog from '../NewProjectDialog'
import styles from './ProjectsPage.styles'

const useStyles = makeStyles(styles)

function ProjectsPage() {
  const classes = useStyles()
  const match = useRouteMatch()
  const { showError, showSuccess } = useNotifications()
  const [newDialogOpen, changeNewDialogOpen] = useState(false)
  const toggleDialog = () => changeNewDialogOpen(!newDialogOpen)

  const firestore = useFirestore()
  const { FieldValue } = useFirestore
  const user = useUser()
  const projectsRef = firestore.collection(PROJECTS_COLLECTION)
  const currentUsersProjectsRef = projectsRef.where('createdBy', '==', user.uid)
  const collabProjectsRef = projectsRef.where(
    `collaborators.${user.uid}`,
    '==',
    true
  )

  const currentUsersProjects = useFirestoreCollectionData(
    currentUsersProjectsRef,
    { idField: 'id' }
  )
  const collabProjects = useFirestoreCollectionData(collabProjectsRef, {
    idField: 'id'
  })
  const projects = currentUsersProjects.concat(collabProjects)

  /**
   * Handler for adding a project
   */
  async function addProject(newInstance) {
    if (!user.uid) {
      return showError('You must be logged in to create a project')
    }
    try {
      toggleDialog()
      await firestore.collection(PROJECTS_COLLECTION).add({
        ...newInstance,
        createdBy: user.uid,
        createdAt: FieldValue.serverTimestamp(),
        permissions: {
          [user.uid]: {
            role: 'owner',
            updatedAt: FieldValue.serverTimestamp()
          }
        },
        roles: defaultRoles
      })
      showSuccess('Project added successfully')
      triggerAnalyticsEvent('createProject')
    } catch (err) {
      showError(err.message || 'Could not add project')
      throw err
    }
  }

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

  return (
    <Switch>
      {/* Child routes */}
      {renderChildren([ProjectRoute])}
      {/* Main Route */}
      <Route
        exact
        path={match.path}
        render={() => (
          <div className={classes.root}>
            <NewProjectDialog
              onSubmit={addProject}
              open={newDialogOpen}
              onRequestClose={toggleDialog}
            />
            <div className={classes.tiles}>
              <NewProjectTile onClick={toggleDialog} />
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
            </div>
          </div>
        )}
      />
    </Switch>
  )
}

ProjectsPage.propTypes = {
  match: PropTypes.object.isRequired // from enhancer (withRouter)
}

export default ProjectsPage
