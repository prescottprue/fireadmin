export default theme => ({
  root: {
    height: '100%',
    marginTop: '3rem'
  },
  heading: {
    fontSize: '1.75rem',
    fontColor: theme.palette.text.primary,
    color: 'rgba(0, 0, 0, 0.54)',
    fontWeight: theme.typography.fontWeightRegular
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  order: {
    fontSize: '1rem',
    fontColor: theme.palette.text.primary,
    color: 'rgba(0, 0, 0, 0.54)',
    fontWeight: theme.typography.fontWeightRegular
  },
  filter: {
    display: 'flex',
    marginBottom: '.5rem'
  },
  filterText: {
    fontSize: '1rem',
    fontColor: theme.palette.text.primary,
    color: 'rgba(0, 0, 0, 0.54)',
    fontWeight: theme.typography.fontWeightRegular
  }
})
