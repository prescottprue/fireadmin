import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { firebasePaths, paths } from 'constants'
import { withHandlers, withStateHandlers } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading, withRouter } from 'utils/components'

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
        showSuccess('Template updated successfully')
        return res
      } catch (err) {
        showError('Error updating template')
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
        router.push(paths.dataMigration)
        showSuccess('Template deleted successfully')
        return res
      } catch (err) {
        showError('Error updating template')
      }
    }
  }),
  spinnerWhileLoading(['template'])
)
