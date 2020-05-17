import React from 'react'
import { Link } from 'react-router-dom'
import { useUser } from 'reactfire'
import Button from '@material-ui/core/Button'
import { LIST_PATH, LOGIN_PATH } from 'constants/paths'
import AccountMenu from './AccountMenu'
import NavbarWithoutAuth from './NavbarWithoutAuth'

const buttonStyle = {
  color: 'white',
  textDecoration: 'none',
  alignSelf: 'center'
}

function Navbar() {
  const user = useUser()
  const authExists = !!user && !!user.uid

  return (
    <NavbarWithoutAuth brandPath={authExists ? LIST_PATH : '/'}>
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
    </NavbarWithoutAuth>
  )
}

export default Navbar
