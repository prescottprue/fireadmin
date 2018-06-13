import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { withStateHandlers, flattenProp, withProps } from 'recompose'
import red from '@material-ui/core/colors/red'

const styles = theme => ({
  card: {
    maxWidth: 400,
    height: '10rem'
  },
  media: {
    height: 194,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordWrap: 'no-wrap'
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
  flattenProp('template'),
  withProps(({ description }) => ({
    truncatedDescription:
      description &&
      `${description.substring(0, 85)}${description.length >= 85 ? '...' : ''}`
  }))
)
