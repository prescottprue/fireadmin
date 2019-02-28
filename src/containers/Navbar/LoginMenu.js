import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { LOGIN_PATH } from 'constants/paths'

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
