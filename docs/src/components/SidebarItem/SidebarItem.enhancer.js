import { compose } from 'redux'
import { withStateHandlers, withProps } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { get, filter } from 'lodash'
import { Link } from 'gatsby'
import styles from './SidebarItem.styles'
import { slugIsInCurrentPath } from '../../utils'

function getChildChapters(pages) {
  return filter(pages, page => {
    const slug = get(page, 'node.frontmatter.slug') || ''
    return slug.split('/').length > 1
  })
}

export default compose(
  withStateHandlers(() => ({ open: false }), {
    toggleOpen: ({ open }) => () => {
      return {
        open: !open
      }
    }
  }),
  withProps(({ childPages, frontmatter, toggleOpen, location }) => {
    const childChapters = getChildChapters(childPages)
    return {
      childChapters,
      parentMatchesPath: slugIsInCurrentPath(frontmatter.slug),
      parentProps:
        childChapters && childChapters.length
          ? { onClick: toggleOpen }
          : { component: Link, to: frontmatter.slug }
    }
  }),
  withStyles(styles)
)
