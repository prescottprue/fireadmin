export default theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  content: {
    width: '100%'
  },
  roleSelect: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '2rem'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
})
