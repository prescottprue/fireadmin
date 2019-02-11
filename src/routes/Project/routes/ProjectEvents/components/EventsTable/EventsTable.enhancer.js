import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { renderWhileEmpty } from 'utils/components'
import NoProjectEvents from './NoProjectEvents'
import styles from './EventsTable.styles'

export default compose(
  renderWhileEmpty('groupedEvents', NoProjectEvents),
  withStyles(styles)
)
