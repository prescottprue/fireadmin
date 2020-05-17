import React, { useState } from 'react'
import { map } from 'lodash'
import { useFirestore, useUser, useFirestoreCollectionData } from 'reactfire'
import * as Sentry from '@sentry/browser'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { ACTION_TEMPLATES_PATH } from 'constants/firebasePaths'
import { triggerAnalyticsEvent } from 'utils/analytics'
import useNotifications from 'modules/notification/useNotifications'
import NewActionTemplateDialog from '../NewActionTemplateDialog'
import ActionTemplateListCard from '../ActionTemplateListCard'
import PrivateActionTemplates from '../PrivateActionTemplates'
import styles from './ActionTemplatesList.styles'

const useStyles = makeStyles(styles)

function useActionTemplatesList() {
  const { showSuccess, showError } = useNotifications()

  // State
  const [newDialogOpen, changeDialogState] = useState(false)
  const [templateToDelete, changeTemplateToDelete] = useState(null)
  const [deleteDialogOpen, changeDeleteDialogState] = useState(false)
  const toggleNewDialog = () => changeDialogState(!newDialogOpen)
  const toggleDeleteDialog = (templateData) => {
    changeTemplateToDelete(templateData || null)
    changeDeleteDialogState(!newDialogOpen)
  }

  // Data connection
  const firestore = useFirestore()
  const { FieldValue } = useFirestore
  const user = useUser()
  const templatesRef = firestore.collection(ACTION_TEMPLATES_PATH)
  const publicActionTemplatesRef = firestore
    .collection(ACTION_TEMPLATES_PATH)
    .where('public', '==', true)
    .limit(30)

  const actionTemplates = useFirestoreCollectionData(publicActionTemplatesRef, {
    idField: 'id'
  })

  // Handlers
  async function createNewActionTemplate(newTemplate) {
    if (!user?.uid) {
      showError('You must be logged in to create an action template')
      return null
    }
    try {
      const newTemplateWithMeta = {
        public: false,
        ...newTemplate,
        createdBy: user.uid,
        createdAt: FieldValue.serverTimestamp()
      }
      const addResponse = await templatesRef.add(newTemplateWithMeta)
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
    }
  }

  async function deleteActionTemplate() {
    if (!user?.uid) {
      showError('You must be logged in to delete an action template')
      return null
    }
    try {
      await templatesRef.doc(templateToDelete.id).delete()
      changeDeleteDialogState(false)
      showSuccess('Action template successfully deleted')
    } catch (err) {
      const errMsg = 'Error deleting action template'
      console.error(errMsg, err.message || err) // eslint-disable-line no-console
      Sentry.captureException(err)
      showError(errMsg)
    }
  }
  return {
    user,
    newDialogOpen,
    toggleNewDialog,
    actionTemplates,
    templateToDelete,
    createNewActionTemplate,
    deleteActionTemplate,
    deleteDialogOpen,
    toggleDeleteDialog
  }
}

function ActionTemplatesList() {
  const classes = useStyles()
  const {
    user,
    toggleNewDialog,
    deleteDialogOpen,
    actionTemplates,
    newDialogOpen,
    templateToDelete,
    toggleDeleteDialog,
    createNewActionTemplate,
    deleteActionTemplate
  } = useActionTemplatesList()

  return (
    <>
      <Grid container spacing={8} className={classes.root}>
        <Grid item xs={12} sm={6} lg={3}>
          <Button
            color="primary"
            onClick={toggleNewDialog}
            variant="contained"
            data-test="new-template-button">
            New Template
          </Button>
        </Grid>
      </Grid>
      <div>
        {actionTemplates && actionTemplates.length ? (
          <div>
            <Typography className={classes.sectionHeader}>
              Public Templates
            </Typography>
            <Grid container spacing={8} className={classes.root}>
              {map(actionTemplates, (template, templateIdx) => {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={3}
                    key={`Template-${template.id}-${templateIdx}`}>
                    <ActionTemplateListCard
                      {...template}
                      onDeleteClick={toggleDeleteDialog}
                    />
                  </Grid>
                )
              })}
            </Grid>
          </div>
        ) : null}
      </div>
      {user?.uid ? (
        <PrivateActionTemplates toggleDeleteDialog={toggleDeleteDialog} />
      ) : null}
      <Dialog
        onClose={toggleDeleteDialog}
        aria-labelledby="delete-template-dialog"
        open={deleteDialogOpen}>
        <DialogTitle id="dialog-title">Delete Template</DialogTitle>
        <DialogContent>
          <div>
            Are you sure you want to delete the template named{' '}
            <strong>{templateToDelete?.name || 'Template'}</strong>?
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteActionTemplate}>Cancel</Button>
          <Button color="secondary" onClick={deleteActionTemplate}>
            Delete Template
          </Button>
        </DialogActions>
      </Dialog>
      <NewActionTemplateDialog
        aria-labelledby="new-template-dialog"
        onRequestClose={toggleNewDialog}
        open={newDialogOpen}
        onSubmit={createNewActionTemplate}
      />
    </>
  )
}

export default ActionTemplatesList
