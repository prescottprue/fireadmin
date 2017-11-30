import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { withStateHandlers } from 'recompose'

export default compose(
  firestoreConnect(({ project }) => [
    {
      collection: 'projects',
      doc: project.id,
      subcollections: [{ collection: 'collaborators' }]
    }
  ]),
  connect(({ firestore: { data: { users } } }, { params }) => ({
    users
  })),
  withStateHandlers(
    ({ initialDialogOpen = false }) => ({
      sharingDialogOpen: initialDialogOpen
    }),
    {
      toggleSharingDialog: ({ sharingDialogOpen }) => action => ({
        sharingDialogOpen: !sharingDialogOpen,
        selectedInstance: action
      }),
      toggleDialog: ({ sharingDialogOpen }) => () => ({
        sharingDialogOpen: !sharingDialogOpen
      })
    }
  )
)
