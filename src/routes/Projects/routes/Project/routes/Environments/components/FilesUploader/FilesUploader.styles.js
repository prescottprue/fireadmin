export default (theme) => ({
  root: {
    ...theme.flexColumnCenter,
    flexBasis: '80%',
    width: '100%',
    marginBottom: '.75rem',
    marginTop: '1rem'
  },
  dropzone: {
    ...theme.flexColumnCenter,
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
    cursor: 'pointer',
    minHeight: '5rem',
    border: '2px dashed grey',
    borderRadius: '2px',
    padding: '2rem'
  },
  dropzoneTitle: {
    marginTop: '.875rem',
    marginBottom: '.875rem',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: '1.5rem'
  },
  dropzoneText: {
    fontWeight: '300',
    textAlign: 'center',
    fontSize: '1.09375rem'
  },
  icon: {
    width: '4.625rem',
    height: '2.75rem'
  },
  iconCompact: {
    width: '3.75rem',
    height: '2.5rem',
    marginRight: '.5rem'
  }
})
