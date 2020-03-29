export default (theme) => ({
  root: {
    ...theme.flexColumnCenter,
    ...theme.mixins.gutters(),
    padding: theme.spacing(2),
    width: '90%',
    passing: theme.spacing(1.5),
    minHeight: '20rem'
  },
  name: {
    color: '#212121',
    fontSize: '2.75rem',
    fontWeight: '300'
  },
  description: {
    marginBottom: '2rem'
  },
  item: {
    ...theme.flexColumnCenter,
    justifyContent: 'space-between',
    textAlign: 'center'
  },
  environmentsLabel: {
    marginRight: '.5rem',
    display: 'inline'
  },
  environmentsNumber: {
    display: 'inline'
  }
})
