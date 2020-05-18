import React, { useState } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { useFirestore, useUser } from 'reactfire'
import { makeStyles } from '@material-ui/core/styles'
import * as Sentry from '@sentry/browser'
import ProjectRoute from 'routes/Projects/routes/Project'
import { renderChildren } from 'utils/router'
import useNotifications from 'modules/notification/useNotifications'
import { triggerAnalyticsEvent } from 'utils/analytics'
import defaultRoles from 'constants/defaultRoles'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'
import NewProjectDialog from '../NewProjectDialog'
import styles from './ProjectsPage.styles'
import ProjectsList from '../ProjectsList'

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
      Sentry.captureException(err)
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
            <ProjectsList onNewClick={toggleDialog} />
          </div>
        )}
      />
    </Switch>
  )
}

export default ProjectsPage
