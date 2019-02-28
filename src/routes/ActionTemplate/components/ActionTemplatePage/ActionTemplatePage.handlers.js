import { firebasePaths, paths } from 'constants/paths'
import { triggerAnalyticsEvent } from 'utils/analytics'

/**
 * Handler for updating an action template
 * @param {Object} props - Component props
 * @param {Object} props.router- Function which naviagtes
 * @param {Function} props.router.push - Function which naviagtes to a route
 * @param {Object} props.firestore - Firestore instance from firestoreConnect
 * @param {Object} props.params- Router params
 * @param {String} props.params.templateId - Id of template to delete
 */
export function updateTemplate(props) {
  return async updateVals => {
    const {
      params: { templateId }
    } = props
    const updatePath = `${firebasePaths.actionTemplates}/${templateId}`
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
      Raven.captureException(err)
      props.showError(errMsg)
      throw err
    }
  }
}

/**
 * Handler for deleting an action template
 * @param {Object} props - Component props
 * @param {Object} props.router- Function which naviagtes
 * @param {Function} props.router.push - Function which naviagtes to a route
 * @param {Object} props.firestore - Firestore instance from firestoreConnect
 * @param {Object} props.params- Router params
 * @param {String} props.params.templateId - Id of template to delete
 */
export function deleteTemplate(props) {
  return async () => {
    const {
      params: { templateId }
    } = props
    const updatePath = `${firebasePaths.actionTemplates}/${templateId}`
    try {
      const res = await props.firestore.delete(updatePath)
      triggerAnalyticsEvent('deleteActionTemplate', {
        templateId
      })
      props.showSuccess('Template Deleted Successfully')
      props.router.push(paths.actionTemplates)
      return res
    } catch (err) {
      const errMsg = 'Error Deleting Template'
      console.error(errMsg, err.message || err) // eslint-disable-line no-console
      Raven.captureException(err)
      props.showError(errMsg)
      throw err
    }
  }
}
