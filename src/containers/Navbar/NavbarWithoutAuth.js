import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import DocsIcon from '@material-ui/icons/LibraryBooks'
import { DOCS_URL } from 'constants/docs'
import styles from './Navbar.styles'

const useStyles = makeStyles(styles)

function NavbarWithoutAuth({ children, brandPath }) {
  const classes = useStyles()

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography
          color="inherit"
          variant="h6"
          component={Link}
          to={brandPath || '/'}
          className={classes.brand}
          data-test="brand">
          Fireadmin
        </Typography>
        <Hidden xsDown>
          <Button
            component="a"
            className={classes.otherLink}
            href={DOCS_URL}
            color="inherit"
            data-test="docs-button">
            Docs
          </Button>
        </Hidden>
        <div className={classes.flex} />
        <Hidden smUp>
          <Tooltip title="Docs">
            <IconButton
              component="a"
              href={DOCS_URL}
              color="inherit"
              data-test="docs-button">
              <DocsIcon />
            </IconButton>
          </Tooltip>
        </Hidden>
        {children}
      </Toolbar>
    </AppBar>
  )
}

NavbarWithoutAuth.propTypes = {
  children: PropTypes.element,
  brandPath: PropTypes.string
}

export default NavbarWithoutAuth
