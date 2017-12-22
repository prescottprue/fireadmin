import React from 'react'
import PropTypes from 'prop-types'
import classes from './MigrationTemplatesList.scss'

export const MigrationTemplatesList = ({ migrationTemplatesList }) => (
  <div className={classes.container}>
    <h1>MigrationTemplatesList</h1>
    <div>
      <pre>{JSON.stringify(migrationTemplatesList, null, 2)}</pre>
    </div>
  </div>
)

MigrationTemplatesList.propTypes = {
  migrationTemplatesList: PropTypes.object
}

export default MigrationTemplatesList
