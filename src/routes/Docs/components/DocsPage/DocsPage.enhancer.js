import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { withStyles } from '@material-ui/core/styles'
import styles from './DocsPage.styles'

export default compose(withStyles(styles))
