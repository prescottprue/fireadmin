import React from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'

function Loading({ classes }) {
  return (
    <div className={classes.root}>
      <CircularProgress size={70} />
      <span className={classes.words}>Loading...</span>
    </div>
  )
}

Loading.propTypes = {
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default Loading
