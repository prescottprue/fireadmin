import { get, map } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withProps } from 'recompose'
import { firestoreConnect, firebaseConnect } from 'react-redux-firebase'
import { withNotifications } from 'modules/notification'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import NoCollaboratorsFound from './NoCollaboratorsFound'

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
  // Show loading spinner until project and displayNames load
  spinnerWhileLoading(['project', 'displayNames']),
  withProps(({ project, displayNames }) => {
    const collaborators = map(project.collaborators, (_, uid) => ({
      uid,
      permission: get(project, `collaboratorPermissions.${uid}.permission`),
      displayName: get(displayNames, uid)
    }))
    return {
      // map collaboratorPermissions object into an object with displayName
      collaborators,
      initialValues: collaborators
    }
  }),
  renderWhileEmpty(['collaborators'], NoCollaboratorsFound)
)
