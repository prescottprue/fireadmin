import { get } from 'lodash'
import { compose } from 'redux'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import { DATA_VIEWER_SETUP_FORM } from 'constants'
import styles from './DataViewerSetupForm.styles'

export default compose(
  connect(({ firestore: { data, ordered } }, { projectId }) => ({
    project: get(data, `projects.${projectId}`),
    environments: get(ordered, `environments-${projectId}`)
  })),
  reduxForm({ form: DATA_VIEWER_SETUP_FORM }),
  withStyles(styles)
)
