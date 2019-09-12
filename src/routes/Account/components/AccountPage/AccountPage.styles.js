export default theme => ({
  root: {
    padding: '4rem'
  },
  pane: {
    ...theme.flexColumnCenter
  },
  title: {
    marginTop: '2.5rem'
  },
  settings: {
    ...theme.flexRowCenter,
    alignItems: 'center',
    width: '100%'
  },

  meta: {
    ...theme.flexColumnCenter,
    marginBottom: '3rem',
    marginTop: '2rem',
    textAlign: 'center'
  }
})
