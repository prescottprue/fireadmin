import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import classes from './ProjectPage.scss'

export const ProjectErrorPage = ({ errorMessage }) => (
  <div className={classes.errorPage}>
    <Paper className={classes.errorPaper}>
      <div>Error Loading Project</div>
      <div className={classes.errorMessage}>{errorMessage}</div>
    </Paper>
  </div>
)

ProjectErrorPage.propTypes = {
  errorMessage: PropTypes.string.isRequired
}

export default ProjectErrorPage
