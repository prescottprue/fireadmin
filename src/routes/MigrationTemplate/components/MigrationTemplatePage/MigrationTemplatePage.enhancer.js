import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { firebasePaths } from 'constants'
import { withHandlers } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading } from 'utils/components'

export default compose(
  withNotifications,
  firestoreConnect(props => [
    {
      collection: `${firebasePaths.migrationTemplates}`,
      doc: props.params.templateId
    }
  ]),
  connect(({ firestore: { data: { migrationTemplates } } }, { params }) => ({
    template: get(migrationTemplates, params.templateId)
  })),
  withHandlers({
    updateTemplate: ({
      firestore,
      params: { templateId },
      showSuccess,
      showError
    }) => async updateVals => {
      const updatePath = `${firebasePaths.migrationTemplates}/${templateId}`
      const updatesWithMeta = {
        ...updateVals,
        updatedAt: firestore.FieldValue.serverTimestamp()
      }
      try {
        const res = await firestore.update(updatePath, updatesWithMeta)
        showSuccess('Template updated successfully')
        return res
      } catch (err) {
        showError('Error updating template')
      }
    }
  }),
  spinnerWhileLoading(['template'])
)
