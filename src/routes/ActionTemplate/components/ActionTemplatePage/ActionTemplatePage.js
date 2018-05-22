import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import DeleteTemplateDialog from '../DeleteTemplateDialog'
import ActionTemplateForm from '../ActionTemplateForm'
import classes from './ActionTemplatePage.scss'

export const ActionTemplatePage = ({
  template,
  updateTemplate,
  deleteTemplate,
  startTemplateDelete,
  deleteDialogOpen,
  params,
  toggleDeleteDialog
}) => (
  <div className={classes.container}>
    <Typography className={classes.header}>Action Template</Typography>
    <ActionTemplateForm
      onSubmit={updateTemplate}
      templateId={params.templateId}
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

ActionTemplatePage.propTypes = {
  template: PropTypes.object,
  params: PropTypes.object.isRequired,
  deleteTemplate: PropTypes.func.isRequired,
  startTemplateDelete: PropTypes.func.isRequired,
  deleteDialogOpen: PropTypes.bool.isRequired,
  updateTemplate: PropTypes.func.isRequired,
  toggleDeleteDialog: PropTypes.func.isRequired,
  /* eslint-disable react/no-unused-prop-types */
  router: PropTypes.shape({
    push: PropTypes.func.isRequired // used in enhancer (withHandlers)
  }),
  showSuccess: PropTypes.func.isRequired, // used in enhancer (withHandlers)
  showError: PropTypes.func.isRequired // used in enhancer (withHandlers)
  /* eslint-enable react/no-unused-prop-types */
}

export default ActionTemplatePage
