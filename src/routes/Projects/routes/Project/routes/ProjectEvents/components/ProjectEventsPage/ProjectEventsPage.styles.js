export default (theme) => ({
  body: {
    overflowY: 'hidden',
    height: '100%'
  },
  content: {
    overflowY: 'scroll',
    heigth: '100%',
    padding: '.5rem',
    paddingBottom: '6rem'
  },
  pageHeader: theme.pageHeader,
  tableBody: {
    paddingBottom: '3rem'
  },
  sectionHeader: {
    fontSize: '1.3rem'
  },
  tableRowDivider: {
    color: 'rgba(0,0,0,0.54)',
    backgroundColor: '#f5f5f5',
    borderTop: '1px solid rgba(0,0,0,0.12)',
    fontSize: '1.1rem',
    fontWeight: 'bold'
  },
  empty: {
    textAlign: 'center',
    padding: '3rem'
  }
})
