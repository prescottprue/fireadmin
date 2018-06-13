import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
// import { Link } from 'react-router'
// import { paths } from 'constants'
import classes from './Home.scss'

export const Home = ({ goToLogin }) => (
  <div className={classes.container}>
    <Paper className={classes.paper}>
      <div className={classes.header}>
        Fireadmin helps you mange Firebase apps while you grow your team
      </div>
      <div className={classes.getStarted}>
        <Button color="primary" onClick={goToLogin}>
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
              <a href={'https://github.com/prescottprue/fireadmin'}>
                available on Github .
              </a>
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
    <Paper className={classes.paper}>
      <div className={classes.header}>Use only what you need</div>
      <div className={classes.lower}>
        <div className={classes.sectionVertical}>
          <div className={classes.bottomSection}>
            <h4>Multiple Environment Support</h4>
            <p>Manage multiple Firebase Instances as one Project.</p>
          </div>
          <div className={classes.bottomSection}>
            <h4>Custom Actions</h4>
            <p>
              Copy data from one instance to another without worrying about
              selecting the wrong file. Create reports on the size of data
              collections of your instances.
            </p>
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

Home.propTypes = {
  goToLogin: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default Home
