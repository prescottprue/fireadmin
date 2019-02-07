import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

function HomePage({ homePage, classes }) {
  return (
    <div className={classes.root}>
      <div className={classes.words}>
        <Typography variant="h4" color="inherit" noWrap>
          Fireadmin Documentation
        </Typography>
        <Typography variant="body1" color="inherit" className={classes.body}>
          Covering everything from general usage and feature explanation to
          understanding the source code
        </Typography>
      </div>
    </div>
  )
}

HomePage.propTypes = {
  classes: PropTypes.object, // from enhancer (withStyles)
  homePage: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default HomePage
