import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
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

const useStyles = makeStyles(styles)

function useActionTemplatePage({ templateId }) {
  const history = useHistory()
  const firestore = useFirestore()
  const { FieldValue } = useFirestore
  const { showError, showSuccess } = useNotifications()
  const templateRef = firestore.doc(`${ACTION_TEMPLATES_PATH}/${templateId}`)

  /**
   * Handler for updating an action template
   * @param {Object} props - Component props
   * @param {Object} props.firestore - Firestore instance from firestoreConnect
   * @param {String} props.templateId - Id of template to delete
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
   * @param {Object} props - Component props
   * @param {Object} props.history - History object from react-router-dom
   * @param {Function} props.history.push - Function which navigates to a route
   * @param {Object} props.firestore - Firestore instance from firestoreConnect
   * @param {String} props.templateId - Id of template to delete
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

  if (!template) {
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
          template.createdBy === user.uid ||
          get(template, `collaborators.${user.uid}`, false)
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

ActionTemplatePage.propTypes = {
  template: PropTypes.object,
  deleteTemplate: PropTypes.func.isRequired,
  startTemplateDelete: PropTypes.func.isRequired,
  deleteDialogOpen: PropTypes.bool.isRequired,
  updateTemplate: PropTypes.func.isRequired,
  toggleDeleteDialog: PropTypes.func.isRequired,
  /* eslint-disable react/no-unused-prop-types */
  history: PropTypes.shape({
    push: PropTypes.func.isRequired // used in enhancer (withHandlers)
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      templateId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
}

export default ActionTemplatePage
