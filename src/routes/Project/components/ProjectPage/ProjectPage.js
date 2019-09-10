import React from 'react'
import { Route, Switch } from 'react-router-dom'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import SidebarLayout from 'layouts/SidebarLayout'
import { renderChildren } from 'utils/router'
import ActionsRoute from 'routes/Project/routes/Actions'
import BucketConfigRoute from 'routes/Project/routes/BucketConfig'
import EnvironmentsRoute from 'routes/Project/routes/Environments'
import PermissionsRoute from 'routes/Project/routes/Permissions'
import ProjectEventsRoute from 'routes/Project/routes/ProjectEvents'
import OverviewPanel from '../OverviewPanel'
import classes from './ProjectPage.scss'

function ProjectPage({ project, match, params, children }) {
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
          match,
          { project, params }
        )}
        {/* Main Route */}
        <Route
          path="/projects/:projectId"
          render={() => (
            <div className={classes.container}>
              <Typography className={classes.pageHeader}>Overview</Typography>
              <OverviewPanel project={project} params={params} />
            </div>
          )}
        />
      </Switch>
    </SidebarLayout>
  )
}

ProjectPage.propTypes = {
  project: PropTypes.object,
  params: PropTypes.object,
  children: PropTypes.object
}

export default ProjectPage
