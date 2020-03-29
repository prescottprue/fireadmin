export default (theme) => ({
  content: {
    ...theme.flexColumnCenter,
    width: '30rem'
  },
  search: {
    marginTop: '0rem'
  },
  current: {
    marginBottom: '2rem',
    ...theme.flexColumnCenter
  }
})
