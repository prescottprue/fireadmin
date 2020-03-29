export default (theme) => ({
  root: {
    ...theme.flexColumn
  },
  field: theme.field,
  buttons: {
    ...theme.flexRow,
    justifyContent: 'flex-start',
    marginTop: '2rem',
    marginBottom: '2rem'
  },
  paper: {
    padding: '2rem',
    width: '60%' // TODO: Replace with grid
  },
  actions: {
    marginTop: '2rem'
  },
  header: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '1.6rem',
    marginRight: '2rem'
  },
  addAction: {
    marginBottom: '2rem'
  },
  title: {
    fontSize: '1.2rem'
  },
  publicToggle: {
    maxWidth: '5rem',
    marginTop: '1.5rem',
    marginBottom: '0.5rem'
  },
  button: {
    margin: theme.spacing(),
    cursor: 'finger'
  }
})
