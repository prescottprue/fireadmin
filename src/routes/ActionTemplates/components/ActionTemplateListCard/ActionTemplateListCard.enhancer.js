import { compose } from 'redux'
import { withStyles } from 'material-ui/styles'
import { withStateHandlers, flattenProp } from 'recompose'
import red from 'material-ui/colors/red'

const styles = theme => ({
  card: {
    maxWidth: 400
  },
  media: {
    height: 194
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  },
  flexGrow: {
    flex: '1 1 auto'
  }
})

export default compose(
  withStyles(styles),
  withStateHandlers(
    () => ({
      expanded: false
    }),
    {
      onExpandClick: ({ expanded }) => () => ({
        expanded: !expanded
      })
    }
  ),
  flattenProp('template')
)
