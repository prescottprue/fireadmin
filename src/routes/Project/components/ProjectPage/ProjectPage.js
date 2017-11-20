import React from 'react'
import PropTypes from 'prop-types'
import SidebarLayout from 'layouts/SidebarLayout'

export const ProjectPage = ({ project, params, children }) => (
  <SidebarLayout title={project.name}>{children}</SidebarLayout>
)

ProjectPage.propTypes = {
  project: PropTypes.object,
  params: PropTypes.object,
  children: PropTypes.object
}

export default ProjectPage
