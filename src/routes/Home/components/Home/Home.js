import React from 'react'
import Theme from 'theme'
import { Link } from 'react-router'
import Paper from 'material-ui-next/Paper'
import { paths } from 'constants'
import classes from './Home.scss'

export const Home = () => (
  <div
    className={classes.container}
    style={{ color: Theme.palette.primary2Color }}>
    <Paper className={classes.paper}>
      <div className="flex-column-center">
        <h2>Admin Interface for Firebase Project Management</h2>
      </div>
      <div className="flex-column-center">
        <h3>Features Include</h3>
        <div className="flex-row-center">
          <div className={classes.section}>
            <h4>Multiple Environments</h4>
            <p>Manage multiple Firebase Instances as one Project</p>
          </div>
          <div className={classes.section}>
            <h4>Data Migration</h4>
            <p>Copy Data From One instance To another</p>
          </div>
          <div className={classes.section}>
            <h4>Operations Logs</h4>
            <p>Event tracking for all environment projects</p>
          </div>
        </div>
      </div>
      <div className="flex-column-center">
        <h3>Get Started By Creating A Project</h3>
        <div className="flex-column-center">
          <Link to={paths.projects}>Multiple Environments</Link>
        </div>
      </div>
    </Paper>
  </div>
)

export default Home
