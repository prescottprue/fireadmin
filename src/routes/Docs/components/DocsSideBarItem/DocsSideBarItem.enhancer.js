import { compose } from 'redux'
import { withHandlers } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './DocsSideBarItem.styles'

export default compose(
  withHandlers({
    // someHandler: props => value => {}
  }),
  withStyles(styles)
)
