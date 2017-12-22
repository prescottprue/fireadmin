import React from 'react'
import PropTypes from 'prop-types'
import classes from './MigrationTemplatesPage.scss'

export const MigrationTemplatesPage = ({ migrationTemplates }) => (
  <div className={classes.container}>
    <h1>MigrationTemplates</h1>
  </div>
)

MigrationTemplatesPage.propTypes = {
  migrationTemplates: PropTypes.object
}

export default MigrationTemplatesPage
