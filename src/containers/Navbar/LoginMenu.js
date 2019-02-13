import React, { Fragment } from 'react'
import { Link } from 'react-router'
import Button from '@material-ui/core/Button'
import { LOGIN_PATH } from 'constants'

const buttonStyle = {
  color: 'white',
  textDecoration: 'none',
  alignSelf: 'center'
}

function LoginMenu() {
  return (
    <Fragment>
      <Button
        style={buttonStyle}
        component={Link}
        to={LOGIN_PATH}
        data-test="sign-in">
        Sign In
      </Button>
    </Fragment>
  )
}

export default LoginMenu
