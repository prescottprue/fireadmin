import React from 'react'
import PropTypes from 'prop-types'
import { groupBy, map, get, filter } from 'lodash'
import { withStyles } from '@material-ui/core/styles'
import { Link } from '@reach/router'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import SidebarItem from './SidebarItem'
import { theme_color as themeColor } from '../../data/siteConfig'
import { FIREADMIN_URL } from '../constants/paths'

import './index.css'
import 'prismjs/themes/prism-tomorrow.css'

function groupBySlugLength(pages) {
  return groupBy(pages, (page) => {
    const slug = get(page, 'node.frontmatter.slug') || ''
    return slug.split('/')[0]
  })
}

function topLevelChapters(pages) {
  return filter(pages, (page) => {
    const slug = get(page, 'node.frontmatter.slug') || ''
    return slug.split('/').length === 1
  })
}

function Layout(props) {
  const { classes, children, pages, location } = props
  const groupedPages = groupBySlugLength(pages)
  const topLevel = topLevelChapters(pages)
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            component={Link}
            to="/">
            Fireadmin Documentation
          </Typography>
          <div className={classes.grow} />
          <Button color="inherit" component="a" href={FIREADMIN_URL}>
            Go To Console
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{ paper: classes.drawerPaper }}>
        <div className={classes.toolbar} />
        <List>
          {map(topLevel, ({ node: { frontmatter } }, index) => (
            <SidebarItem
              frontmatter={frontmatter}
              childPages={groupedPages[frontmatter.slug]}
              key={`${frontmatter.slug}-${index}`}
              location={location}
            />
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  )
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  pages: PropTypes.array,
  children: PropTypes.array
}

const drawerWidth = 260

const styles = (theme) => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: themeColor
  },
  grow: {
    flexGrow: 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar
})

export default withStyles(styles)(Layout)
