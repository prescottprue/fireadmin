import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  errorPage: {
    ...theme.flexColumnCenter,
    marginTop: theme.spacing(4),
    fontSize: '1.8rem',
    width: '80%',
    marginLeft: '10%'
  },
  errorPaper: {
    ...theme.flexColumnCenter,
    padding: theme.spacing(2),
    width: '60%'
  },
  errorMessage: {
    ...theme.flexColumnCenter,
    padding: theme.spacing(2),
    width: '60%'
  }
}))

function ProjectErrorPage({ errorMessage }) {
  const classes = useStyles()
  return (
    <div className={classes.errorPage}>
      <Paper className={classes.errorPaper}>
        <div>Error Loading Project</div>
        <div className={classes.errorMessage}>{errorMessage}</div>
      </Paper>
    </div>
  )
}

ProjectErrorPage.propTypes = {
  errorMessage: PropTypes.string.isRequired
}

export default ProjectErrorPage
