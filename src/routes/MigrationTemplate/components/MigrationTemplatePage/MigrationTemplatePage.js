import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui-next/Paper'
import MigrationTemplateForm from '../MigrationTemplateForm'
import classes from './MigrationTemplatePage.scss'

export const MigrationTemplatePage = ({ template, updateTemplate }) => (
  <div className={classes.container}>
    <h1>Migration Template</h1>
    <Paper className={classes.paper}>
      <MigrationTemplateForm
        onSubmit={updateTemplate}
        initialValues={template}
      />
    </Paper>
  </div>
)

MigrationTemplatePage.propTypes = {
  template: PropTypes.object,
  updateTemplate: PropTypes.func
}

export default MigrationTemplatePage
