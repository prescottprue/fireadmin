import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import NewActionTemplateDialog from '../NewActionTemplateDialog'
import { withStyles } from '@material-ui/core/styles'
import ActionTemplateListCard from '../ActionTemplateListCard'
import classesFromStyles from './ActionTemplatesList.scss'

const styles = theme => ({
  root: {
    flexGrow: 1
  }
})

export const ActionTemplatesList = ({
  actionTemplates,
  myTemplates,
  classes,
  toggleNewDialog,
  newDialogOpen,
  createNewActionTemplate,
  goToTemplate
}) => (
  <div className={classesFromStyles.container}>
    <Button
      color="primary"
      onClick={toggleNewDialog}
      className={classesFromStyles.new}
      variant="raised">
      New Template
    </Button>
    <div>
      {actionTemplates && actionTemplates.length ? (
        <div>
          <Typography className={classesFromStyles.sectionHeader}>
            Public Templates
          </Typography>
          <Grid container spacing={24} className={classes.root}>
            {map(actionTemplates, (template, templateIdx) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={3}
                key={`Template-${template.id}-${templateIdx}`}>
                <ActionTemplateListCard
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
                <ActionTemplateListCard
                  template={template}
                  onClick={() => goToTemplate(template.id)}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      ) : null}
    </div>
    <NewActionTemplateDialog
      onRequestClose={toggleNewDialog}
      open={newDialogOpen}
      onSubmit={createNewActionTemplate}
    />
  </div>
)

ActionTemplatesList.propTypes = {
  actionTemplates: PropTypes.array,
  myTemplates: PropTypes.array,
  toggleNewDialog: PropTypes.func.isRequired,
  createNewActionTemplate: PropTypes.func.isRequired,
  newDialogOpen: PropTypes.bool.isRequired,
  goToTemplate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ActionTemplatesList)
