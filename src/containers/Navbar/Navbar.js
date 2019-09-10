import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import DocsIcon from '@material-ui/icons/LibraryBooks'
import Hidden from '@material-ui/core/Hidden'
import AccountMenu from './AccountMenu'
import LoginMenu from './LoginMenu'
import { LIST_PATH } from 'constants/paths'
import { DOCS_URL } from 'constants/docs'
import Tooltip from '@material-ui/core/Tooltip'

function Navbar({
  avatarUrl,
  displayName,
  authExists,
  goToAccount,
  handleLogout,
  closeAccountMenu,
  anchorEl,
  classes,
  handleMenu
}) {
  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Typography
          color="inherit"
          variant="h6"
          component={Link}
          to={authExists ? LIST_PATH : '/'}
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
        {authExists ? (
          <AccountMenu
            avatarUrl={avatarUrl}
            displayName={displayName}
            onLogoutClick={handleLogout}
            goToAccount={goToAccount}
            closeAccountMenu={closeAccountMenu}
            handleMenu={handleMenu}
            anchorEl={anchorEl}
          />
        ) : (
          <LoginMenu />
        )}
      </Toolbar>
    </AppBar>
  )
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  displayName: PropTypes.string, // from enhancer (flattenProps - profile)
  avatarUrl: PropTypes.string, // from enhancer (flattenProps - profile)
  authExists: PropTypes.bool, // from enhancer (withProps - auth)
  goToAccount: PropTypes.func.isRequired, // from enhancer (withHandlers - router)
  handleLogout: PropTypes.func.isRequired, // from enhancer (withHandlers - firebase)
  closeAccountMenu: PropTypes.func.isRequired, // from enhancer (withHandlers - firebase)
  handleMenu: PropTypes.func.isRequired, // from enhancer (withHandlers - firebase)
  anchorEl: PropTypes.object // from enhancer (withStateHandlers - handleMenu)
}

export default Navbar
