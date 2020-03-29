export default (theme) => ({
  sectionHeader: {
    fontSize: '1.3rem'
  },
  orFont: {
    padding: theme.spacing(2),
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
