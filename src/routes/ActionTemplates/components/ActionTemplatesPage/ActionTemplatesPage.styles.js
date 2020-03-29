export default (theme) => ({
  root: {
    ...theme.flexColumn,
    justifyContent: 'flex-start',
    padding: '2rem',
    paddingTop: '30px',
    flexGrow: '2',
    boxSizing: 'border-box',
    overflowY: 'scroll'
  },
  header: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: '2.25rem',
    alignSelf: 'flex-start',
    marginBottom: '2rem'
  }
})
