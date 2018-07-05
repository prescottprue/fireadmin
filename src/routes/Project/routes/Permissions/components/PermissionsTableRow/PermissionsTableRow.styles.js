export default theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
})
