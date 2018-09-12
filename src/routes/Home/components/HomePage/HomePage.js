import React from 'react'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { Link } from 'react-router'
import { ACTION_TEMPLATES_PATH, LOGIN_PATH } from 'constants'
import classes from './HomePage.scss'

const srcUrl = 'https://github.com/prescottprue/fireadmin'

export const HomePage = () => (
  <div className={classes.container}>
    <Paper className={classes.paper}>
      <div className={classes.header}>
        Fireadmin helps you mange Firebase apps while you grow your team
      </div>
      <div className={classes.getStarted}>
        <Button color="primary" component={Link} to={LOGIN_PATH}>
          Get Started
        </Button>
      </div>
      <div className="flex-column-center">
        <div className={classes.sections}>
          <div className={classes.section}>
            <span className={classes.sectionHeader}>
              Build apps fast, without breaking things
            </span>
            <p>
              Fireadmin allows you to connect multiple Firebase instances into
              one Project for easier tracking as you move code into production.
            </p>
          </div>
          <div className={classes.section}>
            <span className={classes.sectionHeader}>Open Source</span>
            <p>
              Don't want to run it online? Have your own features you want to
              add? The source code on is{' '}
              <a href={srcUrl}>available on Github .</a>
            </p>
          </div>
          <div className={classes.section}>
            <span className={classes.sectionHeader}>
              One console, were you can see what has been done
            </span>
            <p>
              Firebase database work awesome indvidually, but sharing data
              between them can be a pain. Fireadmin makes it easy to move data
              while allowing you to share who in the development team has made
              which changes and when.
            </p>
          </div>
        </div>
      </div>
    </Paper>
    <Paper className={classes.paper} data-test="features">
      <div className={classes.header}>Use only what you need</div>
      <div className={classes.lower}>
        <div className={classes.sectionVertical}>
          <div className={classes.bottomSection}>
            <h4>Multiple Environment Support</h4>
            <p>Manage multiple Firebase Instances as one Project.</p>
          </div>
          <div className={classes.bottomSection}>
            <h4>Custom Action Templates</h4>
            <p>
              Copy data between environments all the way through your pipeline
              without worrying about it changing along the way.
            </p>
            <Button color="primary" component={Link} to={ACTION_TEMPLATES_PATH}>
              Checkout Action Templates
            </Button>
          </div>
        </div>
        <div className={classes.sectionVertical}>
          <div className={classes.bottomSection}>
            <h4>Project Sharing</h4>
            <p>Share projects with everyone in your team. See who does what.</p>
          </div>
          <div className={classes.bottomSection}>
            <h4>Operations Logs</h4>
            <p>Event tracking for all project based actions.</p>
          </div>
        </div>
      </div>
    </Paper>
    <p className={classes.disclaimer}>
      Not An Offical Firebase Product or Affiliated with Firebase or Google In
      Any Way
    </p>
  </div>
)

HomePage.propTypes = {}

export default HomePage
