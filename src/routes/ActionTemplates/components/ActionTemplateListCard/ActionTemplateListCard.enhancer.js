import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { withStateHandlers, flattenProp, withProps } from 'recompose'
import styles from './ActionTemplateListCard.styles'

export default compose(
  withStateHandlers(
    ({ initialAnchorEl = null }) => ({
      expanded: false,
      anchorEl: initialAnchorEl
    }),
    {
      onExpandClick: ({ expanded }) => () => ({
        expanded: !expanded
      }),
      closeMenu: () => () => ({
        anchorEl: null
      }),
      menuClick: () => e => ({
        anchorEl: e.target
      })
    }
  ),
  flattenProp('template'),
  withProps(({ description }) => ({
    truncatedDescription:
      description &&
      `${description.substring(0, 85)}${description.length >= 85 ? '...' : ''}`
  })),
  withStyles(styles, { withTheme: true })
)
