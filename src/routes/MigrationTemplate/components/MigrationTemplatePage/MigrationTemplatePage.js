import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui-next/Typography'
import MigrationTemplateForm from '../MigrationTemplateForm'
import classes from './MigrationTemplatePage.scss'

export const MigrationTemplatePage = ({ template, updateTemplate }) => (
  <div className={classes.container}>
    <Typography className={classes.header}>Migration Template</Typography>
    <MigrationTemplateForm onSubmit={updateTemplate} initialValues={template} />
  </div>
)

MigrationTemplatePage.propTypes = {
  template: PropTypes.object,
  updateTemplate: PropTypes.func
}

export default MigrationTemplatePage
