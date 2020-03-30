import * as Sentry from '@sentry/browser'
import { ACTION_TEMPLATES_PATH as ACTION_TEMPLATES_ROUTE_PATH } from 'constants/paths'
import { ACTION_TEMPLATES_PATH } from 'constants/firebasePaths'
import { triggerAnalyticsEvent } from 'utils/analytics'

/**
 * Handler for updating an action template
 * @param {Object} props - Component props
 * @param {Object} props.firestore - Firestore instance from firestoreConnect
 * @param {String} props.templateId - Id of template to delete
 */
export function updateTemplate(props) {
  return async (updateVals) => {
    const { templateId } = props
    const updatePath = `${ACTION_TEMPLATES_PATH}/${templateId}`
    const updatesWithMeta = {
      ...updateVals,
      templateId,
      updatedAt: props.firestore.FieldValue.serverTimestamp()
    }
    try {
      const res = await props.firestore.update(updatePath, updatesWithMeta)
      triggerAnalyticsEvent('updateActionTemplate', {
        templateId
      })
      props.showSuccess('Template Updated Successfully')
      return res
    } catch (err) {
      const errMsg = 'Error updating template'
      console.error(errMsg, err.message || err) // eslint-disable-line no-console
      Sentry.captureException(err)
      props.showError(errMsg)
      throw err
    }
  }
}

/**
 * Handler for deleting an action template
 * @param {Object} props - Component props
 * @param {Object} props.history - History object from react-router-dom
 * @param {Function} props.history.push - Function which naviagtes to a route
 * @param {Object} props.firestore - Firestore instance from firestoreConnect
 * @param {String} props.templateId - Id of template to delete
 */
export function deleteTemplate(props) {
  return async () => {
    const { templateId } = props
    const updatePath = `${ACTION_TEMPLATES_PATH}/${templateId}`
    try {
      const res = await props.firestore.delete(updatePath)
      triggerAnalyticsEvent('deleteActionTemplate', {
        templateId
      })
      props.showSuccess('Template Deleted Successfully')
      props.history.push(ACTION_TEMPLATES_ROUTE_PATH)
      return res
    } catch (err) {
      const errMsg = 'Error Deleting Template'
      console.error(errMsg, err.message || err) // eslint-disable-line no-console
      Sentry.captureException(err)
      props.showError(errMsg)
      throw err
    }
  }
}
