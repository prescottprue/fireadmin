export default (theme) => ({
  body: {
    ...theme.flexColumn,
    alignItems: 'center',
    padding: '3rem',
    minWidth: '400px'
  },
  serviceAccounts: {
    marginTop: '1rem',
    marginBottom: '1rem',
    minHeight: '10rem'
  },
  buttons: {
    ...theme.flexRow,
    justifyContent: 'flex-end',
    flexGrow: '1',
    width: '100%',
    marginTop: '2rem',
    marginBottom: '1rem',
    paddingRight: '1rem'
  },
  inputs: {
    marginBottom: '1rem'
  }
})
