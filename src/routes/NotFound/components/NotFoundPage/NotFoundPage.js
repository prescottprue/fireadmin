import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styles from './NotFoundPage.styles'

const useStyles = makeStyles(styles)

function NotFoundPage() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <h1>Whoops! 404!</h1>
      <p>This page was not found.</p>
    </div>
  )
}

export default NotFoundPage
