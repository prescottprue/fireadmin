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
  createNewMigrationTemplate,
  goToTemplate
}) => (
  <div className={classes.container}>
    <Button
      raised
      color="primary"
      onClick={toggleNewDialog}
      className={classes.new}>
      New Template
    </Button>
    {map(migrationTemplates, (template, templateIdx) => (
      <MigrationTemplateListCard
        key={`Template-${template.id}-${templateIdx}`}
        template={template}
        onClick={() => goToTemplate(template.id)}
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
  newDialogOpen: PropTypes.bool.isRequired,
  goToTemplate: PropTypes.func.isRequired
}

export default MigrationTemplatesList
