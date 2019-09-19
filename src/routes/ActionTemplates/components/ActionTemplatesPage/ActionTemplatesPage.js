import React from 'react'
import Typography from '@material-ui/core/Typography'
import ActionTemplatesList from '../ActionTemplatesList'
import { makeStyles } from '@material-ui/core/styles'
import styles from './ActionTemplatesPage.styles'

const useStyles = makeStyles(styles)

function ActionTemplatesPage() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Typography className={classes.header}>Action Templates</Typography>
      <ActionTemplatesList />
    </div>
  )
}

export default ActionTemplatesPage
