import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import styles from './ActionTemplatePage.styles'

const useStyles = makeStyles(styles)

function TemplateLoadingError({ errorMessage }) {
  const classes = useStyles()

  return (
    <div className={classes.error}>
      <Typography className={classes.errorMessage}>
        Error loading templates: {errorMessage}
      </Typography>
    </div>
  )
}

TemplateLoadingError.propTypes = {
  errorMessage: PropTypes.string.isRequired
}

export default TemplateLoadingError
