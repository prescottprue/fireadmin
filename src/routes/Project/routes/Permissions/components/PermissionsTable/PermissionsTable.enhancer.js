import { get, map } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withProps } from 'recompose'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading } from 'utils/components'

export default compose(
  withNotifications,
  firebaseConnect(['displayNames']),
  // Create listeners for Firestore
  firestoreConnect(({ projectId }) => [
    // Project environments
    {
      collection: 'projects',
      doc: projectId,
      subcollections: [{ collection: 'environments' }]
    },
    // Project
    {
      collection: 'projects',
      doc: projectId
    }
  ]),
  // Map redux state to props
  connect(({ firebase: { auth, data }, firestore }, { projectId }) => ({
    auth,
    displayNames: data.displayNames,
    project: get(firestore, `data.projects.${projectId}`)
  })),
  spinnerWhileLoading(['project', 'displayNames']),
  withProps(({ project, displayNames }) => ({
    // map collaboratorPermissions object into an object with displayName
    permissions: map(
      project.collaboratorPermissions,
      ({ permission }, uid) => ({
        uid,
        permission,
        displayName: get(displayNames, uid)
      })
    ),
    collaborators: map(project.permissions, (_, uid) => ({
      uid
    }))
  }))
)