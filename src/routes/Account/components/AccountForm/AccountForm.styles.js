export default theme => ({
  root: {
    ...theme.flexColumnCenter,
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
    margin: '.2rem'
  },
  fields: {
    marginTop: '2.5rem'
  },
  avatar: {
    textAlign: 'center'
  },
  avatarCurrent: {
    width: '100%',
    maxWidth: '13rem',
    height: 'auto',
    cursor: 'pointer'
  },
  meta: {
    ...theme.flexColumnCenter,
    marginBottom: '3rem',
    marginTop: '2rem',
    textAlign: 'center'
  },
  buttons: {
    marginBottom: '3rem'
  }
})
