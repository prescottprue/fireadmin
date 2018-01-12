import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Typography from 'material-ui-next/Typography'
import IconButton from 'material-ui-next/IconButton'
import Tooltip from 'material-ui-next/Tooltip'
import DeleteTemplateDialog from '../DeleteTemplateDialog'
import ActionTemplateForm from '../ActionTemplateForm'
import BackIcon from 'material-ui-icons/ArrowBack'
import { paths } from 'constants'
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
    <Link to={paths.dataAction}>
      <Tooltip placement="bottom" title="Back To Templates">
        <IconButton className={classes.submit}>
          <BackIcon />
        </IconButton>
      </Tooltip>
    </Link>
    <ActionTemplateForm
      onSubmit={updateTemplate}
      initialValues={{
        inputs: [{ type: 'serviceAccount', resource: 'storage' }],
        ...template
      }}
      templateId={params.templateId}
      startTemplateDelete={startTemplateDelete}
    />
    <DeleteTemplateDialog
      open={deleteDialogOpen}
      onClose={toggleDeleteDialog}
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
  toggleDeleteDialog: PropTypes.func.isRequired
}

export default ActionTemplatePage
