export default (theme) => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  roleSelect: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: '2rem'
  },
  buttons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: '.5rem'
  },
  optionsLabels: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '1.5rem',
    marginRight: '1rem'
  },
  optionLabel: {
    marginBottom: '1rem',
    marginTop: '1rem'
  },
  roleOption: {
    marginLeft: '1rem'
  },
  roleOptions: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '1rem',
    marginLeft: '1rem'
  },
  resourcePermissionsHeader: {
    marginBottom: '1rem',
    marginTop: '-2rem',
    fontSize: '1.1rem'
  }
})
