import React, { useState } from 'react'
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire'
import { useHistory, useParams } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { ACTION_TEMPLATES_PATH as ACTION_TEMPLATES_ROUTE_PATH } from 'constants/paths'
import { triggerAnalyticsEvent } from 'utils/analytics'
import useNotifications from 'modules/notification/useNotifications'
import { ACTION_TEMPLATES_PATH } from 'constants/firebasePaths'
import DeleteTemplateDialog from '../DeleteTemplateDialog'
import ActionTemplateForm from '../ActionTemplateForm'
import styles from './ActionTemplatePage.styles'
import TemplateNotFound from './TemplateNotFound'
import { withErrorBoundary } from 'utils/components'

const useStyles = makeStyles(styles)

function useActionTemplatePage({ templateId }) {
  const history = useHistory()
  const firestore = useFirestore()
  const { FieldValue } = useFirestore
  const { showError, showSuccess } = useNotifications()
  const templateRef = firestore.doc(`${ACTION_TEMPLATES_PATH}/${templateId}`)

  /**
   * Handler for updating an action template
   * @param {String} updateVals - Values from submitting form
   */
  async function updateTemplate(updateVals) {
    const updatePath = `${ACTION_TEMPLATES_PATH}/${templateId}`
    const updatesWithMeta = {
      ...updateVals,
      templateId,
      updatedAt: FieldValue.serverTimestamp()
    }
    try {
      const res = await templateRef.update(updatePath, updatesWithMeta)
      triggerAnalyticsEvent('updateActionTemplate', {
        templateId
      })
      showSuccess('Template Updated Successfully')
      return res
    } catch (err) {
      const errMsg = 'Error updating template'
      console.error(errMsg, err.message || err) // eslint-disable-line no-console
      Sentry.captureException(err)
      showError(errMsg)
      throw err
    }
  }

  /**
   * Handler for deleting an action template
   */
  async function deleteTemplate() {
    try {
      await templateRef.delete()
      triggerAnalyticsEvent('deleteActionTemplate', {
        templateId
      })
      showSuccess('Template Deleted Successfully')
      history.push(ACTION_TEMPLATES_ROUTE_PATH)
    } catch (err) {
      const errMsg = 'Error Deleting Template'
      console.error(errMsg, err.message || err) // eslint-disable-line no-console
      Sentry.captureException(err)
      showError(errMsg)
      throw err
    }
  }
  return { templateRef, updateTemplate, deleteTemplate }
}

function ActionTemplatePage() {
  const classes = useStyles()
  const { templateId } = useParams()
  const {
    templateRef,
    updateTemplate,
    deleteTemplate
  } = useActionTemplatePage({ templateId })
  const template = useFirestoreDocData(templateRef)
  const user = useUser()
  const [deleteDialogOpen, changeDeleteDialogOpen] = useState(false)
  const toggleDeleteDialog = () => changeDeleteDialogOpen(!deleteDialogOpen)
  const startTemplateDelete = () => changeDeleteDialogOpen(true)

  if (!template?.createdBy) {
    return <TemplateNotFound />
  }

  return (
    <div className={classes.root}>
      <Typography className={classes.header}>Action Template</Typography>
      <ActionTemplateForm
        onSubmit={updateTemplate}
        templateId={templateId}
        startTemplateDelete={startTemplateDelete}
        editable={
          template?.createdBy === user?.uid ||
          (!!template?.collaborators && !!template.collaborators[user.uid])
        }
        defaultValues={template}
      />
      <DeleteTemplateDialog
        open={deleteDialogOpen}
        onClose={toggleDeleteDialog}
        templateName={template.name}
        onDeleteClick={deleteTemplate}
      />
    </div>
  )
}

export default withErrorBoundary(<TemplateNotFound />)(ActionTemplatePage)
