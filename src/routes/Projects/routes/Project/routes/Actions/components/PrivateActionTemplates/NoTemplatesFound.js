import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styles from './PrivateActionTemplates.styles'

const useStyles = makeStyles(styles)

function NoTemplatesFound() {
  const classes = useStyles()

  return <div className={classes.root}>No Private Templates Found</div>
}

export default NoTemplatesFound
