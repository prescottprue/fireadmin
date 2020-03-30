import { get } from 'lodash'
import { compose } from 'redux'
import firebaseConnect from 'react-redux-firebase/lib/firebaseConnect'
import {
  withHandlers,
  pure,
  lifecycle,
  renderNothing,
  setDisplayName
} from 'recompose'
import { connect } from 'react-redux'

export default compose(
  setDisplayName('VersionChangeReloader'),
  firebaseConnect(['versionInfo']),
  connect(({ firebase: { data: { versionInfo } } }) => ({ versionInfo })),
  withHandlers({
    setVersionToStorage: (props) => (refreshVersion) => {
      window.sessionStorage.setItem('fireadminVersion', refreshVersion)
    },
    // Call page reload page and set refreshed version to session storage
    refreshPage: (props) => (refreshVersion) => {
      window.location.reload(true)
    }
  }),
  lifecycle({
    // props change is use to set version on state change
    componentWillReceiveProps(np) {
      const currentRemoteVersion = get(np, 'versionInfo.current')
      const currentClientVersion = window.version
      const sessionVersion = window.sessionStorage.getItem('fireadminVersion')

      // set version to session storage if it does not exist
      if (!sessionVersion) {
        this.props.setVersionToStorage(currentRemoteVersion)
        // Exit since the client does not have a version in session stoage
        return
      }

      // Exit if there is no current remote version
      if (!currentRemoteVersion) {
        return
      }

      // Check if version in Database matches client's session version
      const versionDiscrepencyExists =
        currentRemoteVersion !== currentClientVersion

      // Previous refresh or version set to state has happened
      const refreshHasOccurred = currentRemoteVersion === sessionVersion

      // Refresh if session contains different version than database
      if (versionDiscrepencyExists && !refreshHasOccurred) {
        this.props.refreshPage(currentRemoteVersion)
      }
    }
  }),
  pure,
  renderNothing
)
