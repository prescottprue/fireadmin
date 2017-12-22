import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Button from 'material-ui-next/Button'
import NewMigrationTemplateDialog from '../NewMigrationTemplateDialog'
import MigrationTemplateListCard from '../MigrationTemplateListCard'
import classes from './MigrationTemplatesList.scss'

export const MigrationTemplatesList = ({
  migrationTemplates,
  toggleNewDialog,
  newDialogOpen,
  createNewMigrationTemplate
}) => (
  <div className={classes.container}>
    <Button
      raised
      color="primary"
      onClick={toggleNewDialog}
      className={classes.submit}>
      New Template
    </Button>
    {map(migrationTemplates, (template, templateIdx) => (
      <MigrationTemplateListCard
        key={`Template-${template.key}-${templateIdx}`}
        template={template}
      />
    ))}
    <NewMigrationTemplateDialog
      onRequestClose={toggleNewDialog}
      open={newDialogOpen}
      onSubmit={createNewMigrationTemplate}
    />
  </div>
)

MigrationTemplatesList.propTypes = {
  migrationTemplates: PropTypes.array,
  toggleNewDialog: PropTypes.func.isRequired,
  createNewMigrationTemplate: PropTypes.func.isRequired,
  newDialogOpen: PropTypes.bool.isRequired
}

export default MigrationTemplatesList
