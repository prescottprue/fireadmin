import { compose } from 'redux'
import { connect } from 'react-redux'
import { renderNothing, branch, withHandlers } from 'recompose'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
import { spinnerWhileLoading, renderWhileEmpty } from 'utils/components'
import NoTemplatesFound from './NoTemplatesFound'

export default compose(
  // Map auth uid from state to props
  connect(({ firebase: { auth: { uid } } }) => ({ uid })),
  // Wait for uid to exist before going further
  branch(({ uid }) => !uid, renderNothing),
  // create listener for privateactiontemplates, results go into redux
  firestoreConnect(({ uid }) => [
    {
      collection: 'actionTemplates',
      where: [
        ['createdBy', '==', uid],
        ['public', '==', false]
      ],
      storeAs: 'privateTemplates'
    }
  ]),
  // map redux state to props
  connect(({ firestore: { ordered: { privateTemplates } } }) => ({
    templates: privateTemplates
  })),
  // Show spinner while template is loading
  spinnerWhileLoading(['templates']),
  renderWhileEmpty(['templates'], NoTemplatesFound),
  withHandlers({
    itemClickHandler: (props) => (item) =>
      function onItemClick(e) {
        props.onTemplateClick(item)
      }
  })
)
