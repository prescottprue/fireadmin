export default (theme) => ({
  root: {
    overflowY: 'scroll',
    paddingBottom: '4rem',
    paddingLeft: '.125rem',
    paddingRight: '.125rem'
  },
  pageHeader: theme.pageHeader,
  button: {
    marginLeft: '2rem'
  },
  buttons: {
    ...theme.flexRow,
    marginLeft: '.75rem',
    marginBottom: '2rem',
    justifyContent: 'flex-end'
  }
})
