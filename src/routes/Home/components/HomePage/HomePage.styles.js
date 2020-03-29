export default (theme) => ({
  root: {
    paddingTop: '4rem',
    overflowY: 'scroll',
    '-webkit-overflow-scrolling': 'touch'
  },
  paper: {
    textAlign: 'center',
    // margin: '1rem',
    padding: '3rem'
  },
  section: {
    // ...theme.flexColumn,
    // margin: '1rem'
  },
  disclaimer: {
    marginBottom: '2rem',
    textAlign: 'center'
  },
  getStarted: {
    marginBottom: theme.spacing(4)
  },
  templatesButton: {
    marginTop: theme.spacing(2)
  }
})
