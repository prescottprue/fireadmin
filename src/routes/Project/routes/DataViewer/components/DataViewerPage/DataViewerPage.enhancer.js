import PropTypes from 'prop-types'
import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
import { withStyles } from '@material-ui/core/styles'
import styles from './DataViewerPage.styles'
// import { formValueSelector } from 'redux-form'
// import { formNames } from 'constants'
import { withHandlers, setPropTypes } from 'recompose'
import firebase from 'firebase/app'
import withNotifications from 'modules/notification/components/withNotifications'

export default compose(
  withNotifications,
  // Proptypes for props used in HOCs
  setPropTypes({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired
    })
  }),
  // create listener for dataViewer, results go into redux
  firestoreConnect([{ collection: 'dataViewer' }]),
  // map redux state to props
  // Map redux state to props
  connect((state, { params }) => {
    const {
      firebase,
      firestore: { data, ordered }
    } = state
    // const formSelector = formValueSelector(formNames.actionRunner)
    const environmentsById = get(data, `environments-${params.projectId}`)
    return {
      uid: firebase.auth.uid,
      projectId: params.projectId,
      project: get(data, `projects.${params.projectId}`),
      environments: get(ordered, `environments-${params.projectId}`),
      environmentsById
    }
  }),
  withHandlers({
    getData: ({ showSuccess, showError, projectId }) => formData => {
      return firebase
        .functions()
        .httpsCallable('environmentDataViewer')({ projectId, ...formData })
        .then(() => {
          showSuccess('Data loaded')
        })
        .catch(err => {
          showError('Error loading data')
          return Promise.reject(err)
        })
    }
  }),
  withStyles(styles)
)
