import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles } from '@material-ui/core/styles'
import styles from './Loading.styles'

const useStyles = makeStyles(styles)

function Loading() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CircularProgress size={70} />
      <span className={classes.words}>Loading...</span>
    </div>
  )
}

export default Loading
