import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import styles from './ActionTemplatePage.styles'

const useStyles = makeStyles(styles)

function TemplateNotFound() {
  const classes = useStyles()

  return (
    <div className={classes.notFound}>
      <Typography className={classes.notFoundText}>
        Template Not Found
      </Typography>
    </div>
  )
}

export default TemplateNotFound
