export default theme => ({
  root: {
    ...theme.flexColumnCenter,
    justifyContent: 'flex-start',
    paddingTop: '7rem',
    height: '100%'
  },
  progress: {
    ...theme.flexRowCenter,
    alignItems: 'center',
    height: '50%'
  }
})
