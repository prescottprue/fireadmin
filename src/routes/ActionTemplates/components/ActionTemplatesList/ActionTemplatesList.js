import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { useHistory } from 'react-router-dom'
import { useFirestore, useUser, useFirestoreCollectionData } from 'reactfire'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import * as Sentry from '@sentry/browser'
import { ACTION_TEMPLATES_PATH } from 'constants/firebasePaths'
import { ACTION_TEMPLATES_PATH as ACTION_TEMPLATES_ROUTE } from 'constants/paths'
import { triggerAnalyticsEvent } from 'utils/analytics'
import NewActionTemplateDialog from '../NewActionTemplateDialog'
import ActionTemplateListCard from '../ActionTemplateListCard'
import styles from './ActionTemplatesList.styles'
import useNotifications from 'modules/notification/useNotifications'

const useStyles = makeStyles(styles)

function ActionTemplatesList() {
  const classes = useStyles()
  const history = useHistory()
  const { showSuccess, showError } = useNotifications()
  const firestore = useFirestore()
  const { FieldValue } = useFirestore
  const user = useUser()
  const templatesRef = firestore.collection(ACTION_TEMPLATES_PATH)
  const publicActionTemplatesRef = firestore
    .collection(ACTION_TEMPLATES_PATH)
    .where('public', '==', true)
    .limit(30)
  const currentUserTemplatesRef = firestore
    .collection(ACTION_TEMPLATES_PATH)
    .where('createdBy', '==', user.uid)
    .where('public', '==', false)
  const actionTemplates = useFirestoreCollectionData(publicActionTemplatesRef)
  const myTemplates = useFirestoreCollectionData(currentUserTemplatesRef)
  const [newDialogOpen, changeDialogState] = useState(false)
  const toggleNewDialog = () => changeDialogState(!newDialogOpen)

  async function createNewActionTemplate(newTemplate) {
    try {
      const newTemplateWithMeta = {
        public: false,
        ...newTemplate,
        createdBy: user.uid,
        createdAt: FieldValue.serverTimestamp()
      }
      const addResponse = await templatesRef.add(
        ACTION_TEMPLATES_PATH,
        newTemplateWithMeta
      )
      toggleNewDialog()
      showSuccess('New action template created successfully')
      triggerAnalyticsEvent('createActionTemplate', {
        templateId: addResponse.id,
        templateName: newTemplateWithMeta.name,
        templateIsPublic: newTemplateWithMeta.public
      })
    } catch (err) {
      const errMsg = 'Error creating new template'
      console.error(errMsg, err.message || err) // eslint-disable-line no-console
      Sentry.captureException(err)
      showError(errMsg)
      throw err
    }
  }

  return (
    <div>
      <Button
        color="primary"
        onClick={toggleNewDialog}
        className={classes.new}
        variant="contained">
        New Template
      </Button>
      <div>
        {actionTemplates && actionTemplates.length ? (
          <div>
            <Typography className={classes.sectionHeader}>
              Public Templates
            </Typography>
            <Grid container spacing={8} className={classes.root}>
              {map(actionTemplates, (template, templateIdx) => {
                const goToTemplate = () =>
                  history.push(`${ACTION_TEMPLATES_ROUTE}/${template.id}`)
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={3}
                    key={`Template-${template.id}-${templateIdx}`}>
                    <ActionTemplateListCard
                      template={template}
                      onClick={goToTemplate}
                    />
                  </Grid>
                )
              })}
            </Grid>
          </div>
        ) : null}
      </div>
      <div>
        {myTemplates && myTemplates.length ? (
          <div>
            <Typography className={classes.sectionHeader}>
              Private Templates
            </Typography>
            <Grid container spacing={8} className={classes.root}>
              {map(myTemplates, (template, templateIdx) => {
                const goToTemplate = () =>
                  history.push(`${ACTION_TEMPLATES_ROUTE}/${template.id}`)
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={3}
                    key={`Template-${template.id}-${templateIdx}`}>
                    <ActionTemplateListCard
                      {...template}
                      onClick={goToTemplate}
                    />
                  </Grid>
                )
              })}
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
}

ActionTemplatesList.propTypes = {
  actionTemplates: PropTypes.array,
  myTemplates: PropTypes.array,
  toggleNewDialog: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  createNewActionTemplate: PropTypes.func.isRequired, // from enhancer (withHandlers)
  newDialogOpen: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  goToTemplate: PropTypes.func.isRequired
}

export default ActionTemplatesList
