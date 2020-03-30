export default (theme) => ({
  root: {
    ...theme.flexColumn
  },
  field: theme.field,
  addAction: {
    marginTop: '.5rem',
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: '1.2rem',
    flexBasis: '33.33%',
    flexShrink: '0'
  },
  sections: {
    ...theme.flexRow,
    alignItems: 'center'
  },
  deleteButton: {
    margin: '0px',
    padding: '0px'
  },
  delete: {
    ...theme.flexRow,
    justifyContent: 'flex-end'
  }
})
