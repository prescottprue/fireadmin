export default (theme) => ({
  container: {
    overflowY: 'scroll',
    paddingBottom: '4rem',
    padding: '.125rem'
  },
  pageHeader: theme.pageHeader,
  button: {
    marginLeft: '2rem'
  },
  buttons: {
    ...theme.flexRow,
    marginBottom: '2rem',
    marginLeft: '.75rem'
  },
  or: {
    ...theme.flexRowCenter,
    marginTop: '1rem',
    marginBottom: '1rem'
  },
  orFont: {
    fontSize: '1.3rem'
  },
  search: {
    ...theme.flexRowCenter
  },
  sectionHeader: {
    fontSize: '1.3rem'
  }
})
