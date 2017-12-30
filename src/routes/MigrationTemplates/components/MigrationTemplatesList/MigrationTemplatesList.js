import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Button from 'material-ui-next/Button'
import Typography from 'material-ui-next/Typography'
import NewMigrationTemplateDialog from '../NewMigrationTemplateDialog'
import MigrationTemplateListCard from '../MigrationTemplateListCard'
import classes from './MigrationTemplatesList.scss'

export const MigrationTemplatesList = ({
  migrationTemplates,
  myTemplates,
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
    <Typography className={classes.sectionHeader}>Public Templates</Typography>
    {map(migrationTemplates, (template, templateIdx) => (
      <MigrationTemplateListCard
        key={`Template-${template.id}-${templateIdx}`}
        template={template}
        onClick={() => goToTemplate(template.id)}
      />
    ))}
    <Typography className={classes.sectionHeader}>Private Templates</Typography>
    {map(myTemplates, (template, templateIdx) => (
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
  myTemplates: PropTypes.array,
  toggleNewDialog: PropTypes.func.isRequired,
  createNewMigrationTemplate: PropTypes.func.isRequired,
  newDialogOpen: PropTypes.bool.isRequired,
  goToTemplate: PropTypes.func.isRequired
}

export default MigrationTemplatesList
