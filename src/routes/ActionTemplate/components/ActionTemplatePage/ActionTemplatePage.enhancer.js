import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { firebasePaths, paths } from 'constants'
import {
  withHandlers,
  withStateHandlers,
  onlyUpdateForKeys,
  withProps
} from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import {
  spinnerWhileLoading,
  withRouter,
  renderWhile,
  renderIfError
} from 'utils/components'
import TemplateLoadingError from './TemplateLoadingError'
import TemplateNotFound from './TemplateNotFound'

export default compose(
  withNotifications,
  withRouter,
  // Set listeners for Firestore
  firestoreConnect(props => [
    {
      collection: `${firebasePaths.actionTemplates}`,
      doc: props.params.templateId
    }
  ]),
  // map redux state to props
  connect(({ firestore: { data: { actionTemplates } } }, { params }) => ({
    template: get(actionTemplates, params.templateId)
  })),
  // Show spinner while template is loading
  spinnerWhileLoading(['template']),
  // Render Error page if there is an error in the
  renderIfError(
    (state, { params: { templateId } }) => [
      `${firebasePaths.actionTemplates}.${templateId}`
    ],
    TemplateLoadingError
  ),
  withProps(({ template }) => ({ templateExists: !!template })),
  renderWhile(({ template }) => !template, TemplateNotFound),
  withStateHandlers(
    ({ deleteDialogInitial = false }) => ({
      deleteDialogOpen: false
    }),
    {
      startTemplateDelete: () => () => ({
        deleteDialogOpen: true
      }),
      toggleDeleteDialog: ({ deleteDialogOpen }) => () => ({
        deleteDialogOpen: !deleteDialogOpen
      })
    }
  ),
  withHandlers({
    updateTemplate: ({
      firestore,
      params: { templateId },
      showSuccess,
      showError
    }) => async updateVals => {
      const updatePath = `${firebasePaths.actionTemplates}/${templateId}`
      const updatesWithMeta = {
        ...updateVals,
        templateId,
        updatedAt: firestore.FieldValue.serverTimestamp()
      }
      try {
        const res = await firestore.update(updatePath, updatesWithMeta)
        showSuccess('Template Updated Successfully')
        return res
      } catch (err) {
        showError('Error updating template')
        throw err
      }
    },
    deleteTemplate: ({
      firestore,
      params: { templateId },
      router,
      showSuccess,
      showError
    }) => async () => {
      const updatePath = `${firebasePaths.actionTemplates}/${templateId}`
      try {
        const res = await firestore.delete(updatePath)
        router.push(paths.actionTemplates)
        showSuccess('Template Deleted Successfully')
        return res
      } catch (err) {
        showError('Error Deleting Template')
      }
    },
    goBack: ({ router }) => () => router.push(paths.actionTemplates)
  }),
  onlyUpdateForKeys(['templateExists'])
)
