export default (theme) => ({
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
  type: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
  required: {
    marginTop: '2rem',
    maxWidth: '120px'
  },
  delete: {
    ...theme.flexRow,
    justifyContent: 'flex-end'
  },
  deleteButton: {
    alignSelf: 'flex-end'
  }
})
