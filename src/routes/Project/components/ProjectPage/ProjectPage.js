import React, { cloneElement } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import SidebarLayout from 'layouts/SidebarLayout'
import OverviewPanel from '../OverviewPanel'
import classes from './ProjectPage.scss'

export const ProjectPage = ({ project, params, children }) => (
  <SidebarLayout title={project.name}>
    {!children ? (
      <div className={classes.container}>
        <Typography className={classes.pageHeader}>Overview</Typography>
        <OverviewPanel project={project} params={params} />
      </div>
    ) : (
      cloneElement(children, { project, params })
    )}
  </SidebarLayout>
)

ProjectPage.propTypes = {
  project: PropTypes.object,
  params: PropTypes.object,
  children: PropTypes.object
}

export default ProjectPage
