export default (theme) => ({
  container: {
    ...theme.flexColumn,
    ...theme.mixins.gutters(),
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: '200px',
    width: '300px',
    margin: theme.spacing(0.5),
    padding: theme.spacing(2)
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },
  name: {
    fontSize: '1.5rem',
    fontWeight: '300',
    textDecoration: 'none',
    color: '#616161',
    cursor: 'pointer',
    transition: 'all 800ms cubic-bezier(0.25,0.1,0.25,1) 0ms',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    marginTop: theme.spacing(0.5),
    '&:hover': {
      color: '#03A9F4'
    },
    '&:visited': {
      textDecoration: 'none'
    }
  },
  settings: {
    fontSize: '1.5rem',
    fontWeight: '300',
    textDecoration: 'none',
    color: '#616161',
    '&:hover': {
      color: '#03A9F4'
    }
  },
  createdAt: {
    fontSize: '.7rem',
    color: '#616161',
    transition: 'all 800ms cubic-bezier(0.25,0.1,0.25,1) 0ms',
    marginBottom: '.5rem',
    '&:hover': {
      color: '#03A9F4'
    }
  },
  collaborators: {
    ...theme.flexRow,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    marginTop: '2rem'
  },
  collaborator: {
    ...theme.flexRow,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    marginLeft: '.4rem',
    marginRight: '.4rem',
    overflow: 'hidden',
    cursor: 'pointer',
    '-webkit-filter': 'grayscale(1)',
    filter: 'grayscale(1)',
    '&:hover': {
      '-webkit-filter': 'none',
      filter: 'none',
      img: {
        backgroundColor: '#03A9F4'
      }
    }
  },
  add: {
    '&:hover': {
      color: '#03A9F4'
    }
  }
})
