import React from 'react'
import Theme from 'theme'
import { Link } from 'react-router'
import { paths } from 'constants'
import classes from './Home.scss'

export const Home = () => (
  <div
    className={classes.container}
    style={{ color: Theme.palette.primary2Color }}>
    <div className="flex-column-center">
      <h2>Fireadmin</h2>
      <p>Firebase Project Management UI</p>
    </div>
    <div className="flex-column-center">
      <h3>Features Include</h3>
      <div className="flex-column-center">
        <Link to={paths.projects}>Multiple Environments</Link>
        <Link to={paths.dataMigration}>Data Migration</Link>
      </div>
    </div>
    <div className={classes.builtWith}>
      <h4>Built With</h4>
      <div className="flex-row-center">
        <div className={classes.section}>
          <strong>React</strong>
        </div>
        <div className={classes.section}>
          <strong>Redux</strong>
        </div>
        <div className={classes.section}>
          <strong>Firebase</strong>
          <ul>
            <li>react-redux-firebase</li>
            <li>redux-firestore</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
)

export default Home
