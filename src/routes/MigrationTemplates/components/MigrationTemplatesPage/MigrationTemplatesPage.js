import React from 'react'
// import PropTypes from 'prop-types'
import MigrationTemplatesList from '../MigrationTemplatesList'
import classes from './MigrationTemplatesPage.scss'

export const MigrationTemplatesPage = () => (
  <div className={classes.container}>
    <h1>Migration Templates</h1>
    <MigrationTemplatesList />
  </div>
)

MigrationTemplatesPage.propTypes = {
  // migrationTemplates: PropTypes.object
}

export default MigrationTemplatesPage
