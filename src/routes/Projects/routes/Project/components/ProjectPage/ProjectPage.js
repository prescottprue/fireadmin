import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, useParams } from 'react-router-dom'
import { useFirestore, useFirestoreDocData } from 'reactfire'
import Typography from '@material-ui/core/Typography'
import ActionsRoute from 'routes/Projects/routes/Project/routes/Actions'
import BucketConfigRoute from 'routes/Projects/routes/Project/routes/BucketConfig'
import EnvironmentsRoute from 'routes/Projects/routes/Project/routes/Environments'
import PermissionsRoute from 'routes/Projects/routes/Project/routes/Permissions'
import ProjectEventsRoute from 'routes/Projects/routes/Project/routes/ProjectEvents'
import { makeStyles } from '@material-ui/core/styles'
import SidebarLayout from 'layouts/SidebarLayout'
import { renderChildren } from 'utils/router'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'
import { LIST_PATH } from 'constants/paths'
import OverviewPanel from '../OverviewPanel'
import styles from './ProjectPage.styles'
import ProjectNotFoundPage from './ProjectNotFoundPage'

const useStyles = makeStyles(styles)

function ProjectPage({ children }) {
  const classes = useStyles()
  const { projectId } = useParams()

  const firestore = useFirestore()
  const projectRef = firestore.doc(`${PROJECTS_COLLECTION}/${projectId}`)
  const project = useFirestoreDocData(projectRef)

  if (!project) {
    return <ProjectNotFoundPage />
  }

  return (
    <SidebarLayout title={project.name}>
      <Switch>
        {/* Child routes */}
        {renderChildren(
          [
            ActionsRoute,
            BucketConfigRoute,
            EnvironmentsRoute,
            PermissionsRoute,
            ProjectEventsRoute
          ],
          { project, projectId }
        )}
        {/* Main Route */}
        <Route
          path={`${LIST_PATH}/:projectId`}
          render={() => (
            <div className={classes.root}>
              <Typography className={classes.pageHeader}>Overview</Typography>
              <OverviewPanel project={project} projectId={projectId} />
            </div>
          )}
        />
      </Switch>
    </SidebarLayout>
  )
}

ProjectPage.propTypes = {
  children: PropTypes.object
}

export default ProjectPage
