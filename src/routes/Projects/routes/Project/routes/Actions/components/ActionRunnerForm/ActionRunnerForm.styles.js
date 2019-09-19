export default theme => ({
  sectionHeader: {
    fontSize: '1.3rem'
  },
  button: {
    marginLeft: '2rem'
  },
  orFont: {
    fontWeight: '300',
    fontSize: '1.2rem'
  },
  search: {
    ...theme.flexRowCenter
  },
  heading: {
    fontSize: '1.3rem'
  },
  inputs: {
    ...theme.flexRow,
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  }
})
