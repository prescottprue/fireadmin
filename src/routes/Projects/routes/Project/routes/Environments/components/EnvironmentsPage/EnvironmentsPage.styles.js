export default (theme) => ({
  container: {
    ...theme.flexColumn,
    width: '70%',
    marginLeft: '15%',
    paddingTop: '5rem',
    marginBottom: '4rem'
  },
  pageHeader: theme.pageHeader,
  empty: {
    ...theme.flexRowCenter,
    paddingTop: '5rem'
  },
  paper: {
    ...theme.flexColumn,
    width: '100%',
    padding: '2rem',
    marginBottom: '1rem'
  },
  instances: {
    ...theme.flexRowCenter,
    justifyContent: 'center',
    paddingBottom: '4rem',
    '-webkit-flex-flow': 'row wrap',
    flexWrap: 'wrap',
    padding: '2rem',
    marginBottom: '1rem'
  },
  paragraph: {
    marginTop: '1rem',
    marginBottom: '1rem',
    fontSize: '1rem'
  }
})
