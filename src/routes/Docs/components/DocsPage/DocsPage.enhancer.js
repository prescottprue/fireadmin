import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import styles from './DocsPage.styles'

export default compose(
  // create listener for docs, results go into redux
  firestoreConnect([{ collection: 'docs' }]),
  // map redux state to props
  connect(({ firestore: { data } }) => ({
    docs: data.docs
  })),
  withStyles(styles)
)
