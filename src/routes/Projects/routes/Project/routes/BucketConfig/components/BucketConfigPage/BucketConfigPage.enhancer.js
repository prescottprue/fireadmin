import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { spinnerWhileLoading } from 'utils/components'
import { withStyles } from '@material-ui/core/styles'
import styles from './BucketConfigPage.styles'

export default compose(
  // map redux state to props
  connect(({ firestore: { data, ordered } }, { projectId }) => ({
    project: get(data, `projects.${projectId}`),
    serviceAccounts: get(ordered, `serviceAccountUploads-${projectId}`)
  })),
  // Show loading spinner until data has loaded
  spinnerWhileLoading(['serviceAccounts', 'project']),
  withStyles(styles)
)
