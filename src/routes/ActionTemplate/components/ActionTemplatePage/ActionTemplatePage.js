import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import DeleteTemplateDialog from '../DeleteTemplateDialog'
import ActionTemplateForm from '../ActionTemplateForm'
import styles from './ActionTemplatePage.styles'

const useStyles = makeStyles(styles)

function ActionTemplatePage({
  template,
  updateTemplate,
  deleteTemplate,
  startTemplateDelete,
  deleteDialogOpen,
  match,
  toggleDeleteDialog
}) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography className={classes.header}>Action Template</Typography>
      <ActionTemplateForm
        onSubmit={updateTemplate}
        templateId={match.params.templateId}
        startTemplateDelete={startTemplateDelete}
      />
      <DeleteTemplateDialog
        open={deleteDialogOpen}
        onClose={toggleDeleteDialog}
        templateName={template.name}
        onDeleteClick={deleteTemplate}
      />
    </div>
  )
}

ActionTemplatePage.propTypes = {
  template: PropTypes.object,
  deleteTemplate: PropTypes.func.isRequired,
  startTemplateDelete: PropTypes.func.isRequired,
  deleteDialogOpen: PropTypes.bool.isRequired,
  updateTemplate: PropTypes.func.isRequired,
  toggleDeleteDialog: PropTypes.func.isRequired,
  /* eslint-disable react/no-unused-prop-types */
  history: PropTypes.shape({
    push: PropTypes.func.isRequired // used in enhancer (withHandlers)
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      templateId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  showSuccess: PropTypes.func.isRequired, // used in enhancer (withHandlers)
  showError: PropTypes.func.isRequired // used in enhancer (withHandlers)
  /* eslint-enable react/no-unused-prop-types */
}

export default ActionTemplatePage
