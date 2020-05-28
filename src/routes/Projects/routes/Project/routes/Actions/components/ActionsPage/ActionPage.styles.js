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
    ...theme.flexRowCenter,
    marginTop: theme.spacing(6)
  },
  sectionHeader: {
    display: 'inline-block'
  },
  paperHeader: {
    color: theme.palette.text.secondary,
    textAlign: 'center',
    paddingBottom: 0,
    marginBottom: 0
  },
  paperHeaderText: {
    color: theme.palette.text.secondary,
    paddingBottom: 0
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  helpIcon: {
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1)
  }
})
