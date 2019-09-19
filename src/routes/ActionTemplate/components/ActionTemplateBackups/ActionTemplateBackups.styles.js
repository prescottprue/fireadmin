export default theme => ({
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
  }
})
