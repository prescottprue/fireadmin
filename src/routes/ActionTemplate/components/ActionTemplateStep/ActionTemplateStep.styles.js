export default (theme) => ({
  root: {
    ...theme.flexColumn
  },
  field: theme.field,
  multilineField: theme.multilineField,
  alignCenter: {
    textAlign: 'center'
  },
  content: {
    ...theme.flexColumn
  },
  buttons: {
    ...theme.flexRow,
    justifyContent: 'flex-start',
    marginTop: '2rem',
    marginBottom: '2rem'
  },
  removeButton: {
    ...theme.flexRow,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    padding: '0px',
    width: '100%'
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
    marginTop: '.5rem',
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: '1.2rem'
  },
  subcollectionOption: {
    marginTop: '1rem'
  },
  delete: {
    ...theme.flexRow,
    justifyContent: 'flex-end'
  }
})
