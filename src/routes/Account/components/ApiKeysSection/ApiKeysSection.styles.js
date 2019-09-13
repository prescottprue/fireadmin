export default theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    ...theme.flexColumnCenter,
    flexGrow: 1
  },
  pageHeader: { ...theme.pageHeader },
  buttons: {
    marginBottom: theme.spacing.unit * 3
  }
})
