import React, { cloneElement } from 'react'
import { size } from 'lodash'
import PropTypes from 'prop-types'
import SidebarLayout from 'layouts/SidebarLayout'
import { isEmpty } from 'react-redux-firebase'
import classes from './ProjectPage.scss'

export const ProjectPage = ({ project, params, children }) => (
  <SidebarLayout title={project.name}>
    {!children ? (
      <div className={classes.container}>
        <h2>{project.name}</h2>
        <div className="flex-row">
          <div className="flex-column">
            <h4>Environments</h4>
            <div>
              Current Environments:
              {size(project.environments)}
            </div>
          </div>
        </div>
        Click on the Sidebar to go to a page
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
