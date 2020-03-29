export default (theme) => ({
  root: {
    width: '100%'
  },
  field: theme.field,
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  displayName: {
    width: '15rem',
    marginRight: '2rem',
    overflow: 'hidden'
  },
  permission: {
    marginLeft: '-.75rem'
  },
  menu: {
    ...theme.flexRow,
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: '.5rem'
  },
  roleSelect: {
    marginTop: '2.5rem',
    paddingLeft: '2rem',
    width: '350px'
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  buttons: {
    ...theme.flexRow,
    justifyContent: 'flex-end',
    width: '100%'
  }
})
