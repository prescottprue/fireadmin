export default (theme) => ({
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
  filter: {
    display: 'flex',
    marginBottom: '.5rem'
  },
  filterText: {
    fontSize: '1rem',
    fontColor: theme.palette.text.primary,
    color: 'rgba(0, 0, 0, 0.54)',
    fontWeight: theme.typography.fontWeightRegular
  },
  buttons: {
    ...theme.flexRow,
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: '3rem'
  },
  rolesTable: {
    height: '100%',
    minHeight: '400px'
  }
})
