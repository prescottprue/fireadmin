export default (theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    overflowY: 'scroll'
  },
  pane: {
    ...theme.flexColumnCenter,
    justifyContent: 'space-around',
    padding: theme.spacing(6)
    // maxHeight: '40rem'
  },
  settings: {},
  avatar: {
    maxWidth: '13rem',
    marginTop: '3rem'
  },
  avatarCurrent: {
    width: '100%',
    maxWidth: '13rem',
    marginTop: '3rem',
    height: 'auto',
    cursor: 'pointer'
  },
  title: {
    // marginBottom: theme.spacing(5)
  },
  gridItem: {
    textAlign: 'center',
    marginTop: theme.spacing(5)
  },
  meta: {
    ...theme.flexColumnCenter,
    flexBasis: '60%',
    marginBottom: '3rem',
    marginTop: '2rem'
  }
})
