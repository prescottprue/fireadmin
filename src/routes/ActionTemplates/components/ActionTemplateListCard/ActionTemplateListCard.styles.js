import red from '@material-ui/core/colors/red'

export default (theme) => ({
  card: {
    maxWidth: 400,
    height: '14rem'
  },
  cardTitle: {
    cursor: 'pointer',
    color: theme.palette.text.primary
  },
  media: {
    height: 194,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordWrap: 'no-wrap'
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  avatar: {
    backgroundColor: red[500]
  },
  flexGrow: {
    flex: '1 1 auto'
  }
})
