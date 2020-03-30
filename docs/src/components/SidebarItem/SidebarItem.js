import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { get, filter } from 'lodash'
import { Link, withPrefix } from 'gatsby'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import BookIcon from '@material-ui/icons/Book'
import GuideIcon from '@material-ui/icons/Assignment'
import CodeIcon from '@material-ui/icons/Code'
import Collapse from '@material-ui/core/Collapse'
import WebIcon from '@material-ui/icons/Web'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { slugIsInCurrentPath } from '../../utils'

const ICONS_BY_SLUG = {
  guides: <GuideIcon />,
  source: <CodeIcon />,
  testing: <WebIcon />,
  docs: <BookIcon />,
  default: <InboxIcon />
}

function slugToIcon(slug) {
  return ICONS_BY_SLUG[slug] || ICONS_BY_SLUG.default
}

function getChildChapters(pages) {
  return filter(pages, (page) => {
    const slug = get(page, 'node.frontmatter.slug') || ''
    return slug.split('/').length > 1
  })
}

function SidebarItem({ frontmatter, trimmedPath, childPages }) {
  const childChapters = getChildChapters(childPages)
  const parentMatchesPath = slugIsInCurrentPath(frontmatter.slug)
  const [sidebarOpen, changeOpenState] = useState(false)
  function toggleOpen() {
    changeOpenState(!sidebarOpen)
  }
  const parentProps =
    childChapters && childChapters.length
      ? { onClick: toggleOpen }
      : { component: Link, to: frontmatter.slug }

  return (
    <Fragment>
      <ListItem button {...parentProps}>
        <Fragment>
          <ListItemIcon>{slugToIcon(frontmatter.slug)}</ListItemIcon>
          <ListItemText primary={frontmatter.title} />
          {childChapters.length ? (
            parentMatchesPath || sidebarOpen ? (
              <ExpandLess />
            ) : (
              <ExpandMore />
            )
          ) : null}
        </Fragment>
      </ListItem>
      {childChapters.length ? (
        <Collapse in={parentMatchesPath || sidebarOpen} timeout="auto">
          <List
            component="div"
            disablePadding
            key={`${frontmatter.slug}-Children`}>
            {childChapters.map(({ node }, index2) => (
              <ListItem
                button
                component={Link}
                key={`${frontmatter.slug}-${node.frontmatter.slug}=${index2}`}
                selected={slugIsInCurrentPath(node.frontmatter.slug)}
                to={withPrefix(node.frontmatter.slug)}>
                <ListItemText inset primary={node.frontmatter.title} />
              </ListItem>
            ))}
          </List>
        </Collapse>
      ) : null}
    </Fragment>
  )
}

SidebarItem.propTypes = {
  childChapters: PropTypes.array,
  open: PropTypes.bool,
  toggleOpen: PropTypes.func,
  parentMatchesPath: PropTypes.bool,
  trimmedPath: PropTypes.string,
  matchesFullPath: PropTypes.bool,
  parentProps: PropTypes.object,
  frontmatter: PropTypes.object, // from enhancer (firestoreConnect + connect)
  groupedPages: PropTypes.object
}

export default SidebarItem
