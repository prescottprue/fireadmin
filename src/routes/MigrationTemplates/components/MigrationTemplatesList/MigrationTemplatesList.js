import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Button from 'material-ui-next/Button'
import Grid from 'material-ui-next/Grid'
import Typography from 'material-ui-next/Typography'
import NewMigrationTemplateDialog from '../NewMigrationTemplateDialog'
import { withStyles } from 'material-ui-next/styles'
import MigrationTemplateListCard from '../MigrationTemplateListCard'
import classesFromStyles from './MigrationTemplatesList.scss'

const styles = theme => ({
  root: {
    flexGrow: 1
  }
})

export const MigrationTemplatesList = ({
  migrationTemplates,
  myTemplates,
  classes,
  toggleNewDialog,
  newDialogOpen,
  createNewMigrationTemplate,
  goToTemplate
}) => (
  <div className={classesFromStyles.container}>
    <Button
      raised
      color="primary"
      onClick={toggleNewDialog}
      className={classesFromStyles.new}>
      New Template
    </Button>
    <div>
      {migrationTemplates && migrationTemplates.length ? (
        <div>
          <Typography className={classesFromStyles.sectionHeader}>
            Private Templates
          </Typography>
          <Grid container spacing={24} className={classes.root}>
            {map(migrationTemplates, (template, templateIdx) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={3}
                key={`Template-${template.id}-${templateIdx}`}>
                <MigrationTemplateListCard
                  template={template}
                  onClick={() => goToTemplate(template.id)}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      ) : null}
    </div>
    <div>
      {myTemplates && myTemplates.length ? (
        <div>
          <Typography className={classesFromStyles.sectionHeader}>
            Private Templates
          </Typography>
          <Grid container spacing={24} className={classesFromStyles.root}>
            {map(myTemplates, (template, templateIdx) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={3}
                key={`Template-${template.id}-${templateIdx}`}>
                <MigrationTemplateListCard
                  template={template}
                  onClick={() => goToTemplate(template.id)}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      ) : null}
    </div>
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
  goToTemplate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MigrationTemplatesList)
