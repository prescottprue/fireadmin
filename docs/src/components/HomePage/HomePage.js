import React from 'react'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import styles from './HomePage.styles'

const useStyles = makeStyles(styles)

function HomePage() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.words}>
        <Typography variant="h4" color="inherit" noWrap>
          Fireadmin Documentation
        </Typography>
        <Typography variant="body1" color="inherit" className={classes.body}>
          Covering everything from general usage and feature explanation to
          understanding the source code
        </Typography>
      </div>
    </div>
  )
}

export default HomePage
