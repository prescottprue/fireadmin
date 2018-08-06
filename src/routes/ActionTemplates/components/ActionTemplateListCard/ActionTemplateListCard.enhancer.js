import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { withStateHandlers, flattenProp, withProps } from 'recompose'
import styles from './ActionTemplateListCard.styles'

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
