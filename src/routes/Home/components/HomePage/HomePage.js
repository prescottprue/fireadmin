import React from 'react'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { ACTION_TEMPLATES_PATH, LOGIN_PATH } from 'constants/paths'
import styles from './HomePage.styles'

const srcUrl = 'https://github.com/prescottprue/fireadmin'

const useStyles = makeStyles(styles)

function HomePage() {
  const classes = useStyles()

  return (
    <Grid container spacing={8} justify="center" className={classes.root}>
      <Grid item xs={10} md={8}>
        <Paper className={classes.paper}>
          <Typography variant="h3">
            Fireadmin helps you mange Firebase apps while you grow your team
          </Typography>
          <div className={classes.getStarted}>
            <Button color="primary" component={Link} to={LOGIN_PATH}>
              Get Started
            </Button>
          </div>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6} md={4} className={classes.section}>
              <Typography variant="h6" className={classes.sectionHeader}>
                Build apps fast, without breaking things
              </Typography>
              <Typography variant="subtitle1">
                Fireadmin allows you to connect multiple Firebase instances into
                one Project for easier tracking as you move code into
                production.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.section}>
              <Typography variant="h6" className={classes.sectionHeader}>
                Open Source
              </Typography>
              <Typography variant="subtitle1">
                Don't want to run it online? Have your own features you want to
                add? The source code on is{' '}
                <a href={srcUrl}>available on Github .</a>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} className={classes.section}>
              <Typography variant="h6" className={classes.sectionHeader}>
                One console, were you can see what has been done
              </Typography>
              <Typography variant="subtitle1">
                Firebase database work awesome indvidually, but sharing data
                between them can be a pain. Fireadmin makes it easy to move data
                while allowing you to share who in the development team has made
                which changes and when.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={10} md={8}>
        <Paper className={classes.paper} data-test="features">
          <Typography variant="h3">Use only what you need</Typography>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="h6">Multiple Environment Support</Typography>
              <Typography variant="subtitle1">
                Manage multiple Firebase Instances as one Project.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="h6">Custom Action Templates</Typography>
              <Typography variant="subtitle1">
                Copy data between environments all the way through your pipeline
                without worrying about it changing along the way.
              </Typography>
              <Button
                color="primary"
                component={Link}
                to={ACTION_TEMPLATES_PATH}>
                Checkout Action Templates
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="h6">Project Sharing</Typography>
              <Typography variant="subtitle1">
                Share projects with everyone in your team. See who does what.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Typography variant="h6">Operations Logs</Typography>
              <Typography variant="subtitle1">
                Event tracking for all project based actions.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={8} md={10} className={classes.disclaimer}>
        <Typography className={classes.disclaimer}>
          Not An Offical Firebase Product or Affiliated with Firebase or Google
          In Any Way
        </Typography>
      </Grid>
    </Grid>
  )
}

export default HomePage
