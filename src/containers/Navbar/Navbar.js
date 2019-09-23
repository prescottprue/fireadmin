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
import { LIST_PATH, LOGIN_PATH } from 'constants/paths'
import { isLoaded, isEmpty } from 'react-redux-firebase/lib/helpers'
import { DOCS_URL } from 'constants/docs'
import AccountMenu from './AccountMenu'
import styles from './Navbar.styles'

const buttonStyle = {
  color: 'white',
  textDecoration: 'none',
  alignSelf: 'center'
}

const useStyles = makeStyles(styles)

function Navbar({ history, firebase, auth, profile }) {
  const classes = useStyles()
  const authExists = isLoaded(auth) && !isEmpty(auth)

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
          <AccountMenu />
        ) : (
          <Button
            style={buttonStyle}
            component={Link}
            to={LOGIN_PATH}
            data-test="sign-in">
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

Navbar.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  firebase: PropTypes.shape({
    logout: PropTypes.func.isRequired
  }),
  profile: PropTypes.shape({
    displayName: PropTypes.string, // from enhancer (connect)
    avatarUrl: PropTypes.string // from enhancer (connect)
  })
}

export default Navbar
