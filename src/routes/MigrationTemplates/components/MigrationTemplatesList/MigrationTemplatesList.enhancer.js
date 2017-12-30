import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers, withHandlers } from 'recompose'
import { firebasePaths, paths } from 'constants'
import { firestoreConnect } from 'react-redux-firebase'
import { spinnerWhileLoading, withRouter } from 'utils/components'
import { withNotifications } from 'modules/notification'

export default compose(
  withNotifications,
  withRouter,
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // Wait for uid to exist before going further
  spinnerWhileLoading(['uid']),
  // Set listeners for Firestore
  firestoreConnect(({ uid }) => [
    {
      collection: firebasePaths.migrationTemplates,
      where: ['public', '==', true],
      limit: 30
    },
    // Listener for projects current user collaborates on
    {
      collection: firebasePaths.migrationTemplates,
      where: [['createdBy', '==', uid], ['public', '==', false]],
      storeAs: 'myTemplates'
    }
  ]),
  // map redux state to props
  connect(
    ({
      firestore: { ordered: { migrationTemplates, myTemplates } },
      firebase: { auth: { uid } }
    }) => ({
      uid,
      migrationTemplates,
      myTemplates
    })
  ),
  withStateHandlers(
    () => ({
      newDialogOpen: false
    }),
    {
      toggleNewDialog: ({ newDialogOpen }) => () => ({
        newDialogOpen: !newDialogOpen
      })
    }
  ),
  withHandlers({
    createNewMigrationTemplate: props => async newTemplate => {
      try {
        const newTemplateWithMeta = {
          ...newTemplate,
          createdBy: props.uid,
          createdAt: props.firestore.FieldValue.serverTimestamp()
        }
        await props.firestore.add(
          firebasePaths.migrationTemplates,
          newTemplateWithMeta
        )
        props.toggleNewDialog()
        props.showSuccess('New migration template created successfully')
      } catch (err) {
        props.showError('Error creating new template')
        console.error('Error creating new template:', err.message || err) // eslint-disable-line no-console
      }
    },
    deleteTemplate: props => async templateId => {
      try {
        // TODO: Add delete confirmation
        await props.firestore.delete(firebasePaths.migrationTemplates)
        props.showSuccess('Migration template deleted successfully')
      } catch (err) {
        props.showError('Error deleting migration template')
        console.error('Error deleting migration template:', err.message || err) // eslint-disable-line no-console
      }
    },
    goToTemplate: props => id =>
      props.router.push(`${paths.dataMigration}/${id}`)
  })
)
