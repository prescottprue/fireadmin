import React from 'react'
import PropTypes from 'prop-types'
import MigrationMetaTile from '../MigrationMetaTile'
// import MigrationActionsTile from '../MigrationActionsTile'
import migrationEnhancer from 'routes/Migration/enhancer'
import classes from './MigrationPage.scss'

export const MigrationPage = ({ migration, selectedActions, addAction }) => (
  <div className={classes.container}>
    <MigrationMetaTile />
    {/* <MigrationActionsTile /> */}
  </div>
)

MigrationPage.propTypes = {
  migration: PropTypes.object,
  selectedActions: PropTypes.array,
  addAction: PropTypes.func
}

export default migrationEnhancer(MigrationPage)
