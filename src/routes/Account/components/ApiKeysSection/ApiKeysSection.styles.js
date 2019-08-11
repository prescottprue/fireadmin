export default theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    ...theme.flexColumnCenter,
    flexGrow: 1
  },
  pageHeader: { ...theme.pageHeader },
  buttons: {
    marginBottom: theme.spacing.unit * 3
  },
  tokenCard: {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
    backgroundColor: '#f5f5f5'
  }
})
