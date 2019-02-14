import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { trim } from 'lodash'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import CodeIcon from '@material-ui/icons/Code'
import Collapse from '@material-ui/core/Collapse'
import QueueIcon from '@material-ui/icons/Queue'
import WebIcon from '@material-ui/icons/Web'
import PaintIcon from '@material-ui/icons/FormatPaint'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import { Link, withPrefix } from 'gatsby'

function slugToIcon(slug) {
  switch (slug) {
    case 'onboarding':
      return <PersonAddIcon />
    case 'repos':
      return <CodeIcon />
    case 'environments':
      return <QueueIcon />
    case 'patterns':
      return <PaintIcon />
    case 'testing':
      return <WebIcon />
    default:
      return <InboxIcon />
  }
}

function SidebarItem({
  frontmatter,
  childChapters,
  classes,
  open,
  parentProps,
  toggleOpen,
  parentMatchesPath,
  trimmedPath,
  matchesFullPath
}) {
  return (
    <Fragment>
      <ListItem button {...parentProps} selected={matchesFullPath}>
        <Fragment>
          <ListItemIcon>{slugToIcon(frontmatter.slug)}</ListItemIcon>
          <ListItemText primary={frontmatter.title} />
          {childChapters.length ? open ? <ExpandLess /> : <ExpandMore /> : null}
        </Fragment>
      </ListItem>
      {childChapters.length ? (
        <Collapse in={parentMatchesPath || open} timeout="auto">
          <List
            component="div"
            disablePadding
            key={`${frontmatter.slug}-Children`}>
            {childChapters.map(({ node }, index2) => (
              <ListItem
                button
                component={Link}
                key={`${frontmatter.slug}-${node.frontmatter.slug}=${index2}`}
                selected={location.pathname.includes(
                  withPrefix(node.frontmatter.slug)
                )}
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
  classes: PropTypes.object, // from enhancer (withStyles)
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
