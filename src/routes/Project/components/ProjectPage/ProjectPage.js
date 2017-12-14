import React, { cloneElement } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'react-redux-firebase'
import SidebarLayout from 'layouts/SidebarLayout'
import OverviewPanel from '../OverviewPanel'
import classes from './ProjectPage.scss'

export const ProjectPage = ({ project, params, children }) => (
  <SidebarLayout title={project.name}>
    {!children ? (
      <div className={classes.container}>
        <OverviewPanel project={project} params={params} />
      </div>
    ) : isEmpty(project) ? (
      <div className={classes.container}>Project Not Found</div>
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
