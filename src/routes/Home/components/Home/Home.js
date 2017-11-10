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
      <p>Firebase management tools</p>
    </div>
    <div className="flex-row-center">
      <Link to={paths.dataMigration}>Data Migration</Link>
    </div>
  </div>
)

export default Home
