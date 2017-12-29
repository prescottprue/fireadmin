import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Typography from 'material-ui-next/Typography'
import IconButton from 'material-ui-next/IconButton'
import Tooltip from 'material-ui-next/Tooltip'
import DeleteTemplateDialog from '../DeleteTemplateDialog'
import MigrationTemplateForm from '../MigrationTemplateForm'
import BackIcon from 'material-ui-icons/ArrowBack'
import { paths } from 'constants'
import classes from './MigrationTemplatePage.scss'

export const MigrationTemplatePage = ({
  template,
  updateTemplate,
  deleteTemplate,
  startTemplateDelete,
  deleteDialogOpen,
  toggleDeleteDialog
}) => (
  <div className={classes.container}>
    <Typography className={classes.header}>Migration Template</Typography>
    <Link to={paths.dataMigration}>
      <Tooltip placement="bottom" title="Back To Templates">
        <IconButton className={classes.submit}>
          <BackIcon />
        </IconButton>
      </Tooltip>
    </Link>
    <MigrationTemplateForm
      onSubmit={updateTemplate}
      initialValues={template}
      startTemplateDelete={startTemplateDelete}
    />
    <DeleteTemplateDialog
      open={deleteDialogOpen}
      onClose={toggleDeleteDialog}
      onDeleteClick={deleteTemplate}
    />
  </div>
)

MigrationTemplatePage.propTypes = {
  template: PropTypes.object,
  deleteTemplate: PropTypes.func.isRequired,
  startTemplateDelete: PropTypes.func.isRequired,
  deleteDialogOpen: PropTypes.bool.isRequired,
  updateTemplate: PropTypes.func.isRequired,
  toggleDeleteDialog: PropTypes.func.isRequired
}

export default MigrationTemplatePage
