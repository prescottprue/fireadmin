import React from 'react'
import Typography from 'material-ui/Typography'
import classes from './ActionTemplatePage.scss'

export const TemplateNotFound = () => (
  <div className={classes.notFound}>
    <Typography className={classes.notFoundText}>Template Not Found</Typography>
  </div>
)

export default TemplateNotFound
