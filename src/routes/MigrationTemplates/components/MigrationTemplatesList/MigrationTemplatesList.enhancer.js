import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers, withHandlers } from 'recompose'
import { firebasePaths, paths } from 'constants'
import { firestoreConnect } from 'react-redux-firebase'
import { withRouter } from 'utils/components'
import { withNotifications } from 'modules/notification'

export default compose(
  withNotifications,
  withRouter,
  firestoreConnect([{ collection: firebasePaths.migrationTemplates }]),
  connect(({ firestore: { ordered: { migrationTemplates } } }) => ({
    migrationTemplates
  })),
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
        await props.firestore.add(firebasePaths.migrationTemplates, newTemplate)
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
