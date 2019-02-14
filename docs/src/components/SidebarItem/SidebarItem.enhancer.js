import { compose } from 'redux'
import { withStateHandlers, withProps } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { get, filter, trim } from 'lodash'
import { Link, withPrefix } from 'gatsby'
import styles from './SidebarItem.styles'

function getChildChapters(pages) {
  return filter(pages, page => {
    return get(page, 'node.frontmatter.slug', '').split('/').length > 1
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
      parentMatchesPath:
        location.pathname.split('/').filter(v => !!v)[0] ===
        trim(frontmatter.slug, '/'),
      matchesFullPath: location.pathname === withPrefix(frontmatter.slug),
      parentProps:
        childChapters && childChapters.length
          ? { onClick: toggleOpen }
          : { component: Link, to: frontmatter.slug }
    }
  }),
  withStyles(styles)
)
