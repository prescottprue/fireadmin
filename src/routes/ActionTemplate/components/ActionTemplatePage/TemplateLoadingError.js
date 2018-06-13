import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import classes from './ActionTemplatePage.scss'

export const TemplateLoadingError = ({ errorMessage }) => (
  <div className={classes.error}>
    <Typography className={classes.errorMessage}>
      Error loading templates: {errorMessage}
    </Typography>
  </div>
)

TemplateLoadingError.propTypes = {
  errorMessage: PropTypes.string.isRequired
}

export default TemplateLoadingError
