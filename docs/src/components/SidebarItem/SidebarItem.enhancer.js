import { compose } from 'redux'
import { withStateHandlers, withProps, branch, renderNothing } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { get, filter, trim } from 'lodash'
import { Link } from 'gatsby'
import styles from './SidebarItem.styles'

function getChildChapters(pages) {
  return filter(pages, page => {
    return get(page, 'node.frontmatter.slug', '').split('/').length > 1
  })
}

export default compose(
  // TODO: Remove this once querying is only for non posts
  branch(
    ({ frontmatter }) => frontmatter.slug.includes('code-highlighting-post'),
    renderNothing
  ),
  withStateHandlers(() => ({ open: false }), {
    toggleOpen: ({ open }) => () => {
      return {
        open: !open
      }
    }
  }),
  withProps(({ childPages, frontmatter, toggleOpen, location }) => {
    const childChapters = getChildChapters(childPages)
    const trimmedPath = trim(location.pathname, '/')
    return {
      childChapters,
      parentMatchesPath:
        location.pathname.split('/').filter(v => !!v)[0] ===
        trim(frontmatter.slug, '/'),
      matchesFullPath: trimmedPath === trim(frontmatter.slug, '/'),
      trimmedPath,
      parentProps:
        childChapters && childChapters.length
          ? { onClick: toggleOpen }
          : { component: Link, to: frontmatter.slug }
    }
  }),
  withStyles(styles)
)
