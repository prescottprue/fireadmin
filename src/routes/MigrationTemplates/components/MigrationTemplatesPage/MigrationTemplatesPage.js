import React from 'react'
// import PropTypes from 'prop-types'
import Typography from 'material-ui-next/Typography'
import MigrationTemplatesList from '../MigrationTemplatesList'
import classes from './MigrationTemplatesPage.scss'

export const MigrationTemplatesPage = () => (
  <div className={classes.container}>
    <Typography className={classes.header}>Migration Templates</Typography>
    <MigrationTemplatesList />
  </div>
)

MigrationTemplatesPage.propTypes = {
  // migrationTemplates: PropTypes.object
}

export default MigrationTemplatesPage
