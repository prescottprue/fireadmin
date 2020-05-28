export default (theme) => ({
  root: {
    marginTop: '.75rem'
  },
  button: {
    marginLeft: '2rem'
  },
  buttons: {
    ...theme.flexRow,
    justifyContent: 'flex-end',
    marginTop: '2rem',
    marginBottom: '2rem',
    marginLeft: '.75rem'
  }
})
