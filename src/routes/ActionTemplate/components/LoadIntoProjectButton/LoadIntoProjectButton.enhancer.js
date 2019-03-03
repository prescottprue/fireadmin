import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, renderNothing, branch } from 'recompose'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
import { withRouter } from 'utils/components'

export default compose(
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // Wait for uid to exist before going further
  branch(({ uid }) => !uid, renderNothing),
  // Create listeners based on current users UID
  firestoreConnect(({ params, uid }) => [
    // Listener for projects the current user created
    {
      collection: 'projects',
      where: ['createdBy', '==', uid]
    },
    // Listener for projects current user collaborates on
    {
      collection: 'projects',
      where: [`collaborators.${uid}`, '==', true],
      storeAs: 'collabProjects'
    }
  ]),
  // Map projects from state to props (populating them in the process)
  connect(({ firestore: { ordered: { projects, collabProjects } } }) => ({
    projects,
    collabProjects
  })),
  // Hide if there are no projects
  branch(({ projects }) => !projects, renderNothing),
  withRouter,
  withHandlers({
    onProjectSelect: props => (e, val) => {
      props.router.push(
        `/projects/${e.target.value}/actions?templateId=${props.templateId}`
      )
    }
  })
)
