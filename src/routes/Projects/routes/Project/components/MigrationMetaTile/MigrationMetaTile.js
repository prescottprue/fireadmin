import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui-next/Button'
import Paper from 'material-ui-next/Paper'
import MigrationInstanceTile from '../MigrationInstanceTile'
import classes from './MigrationMetaTile.scss'

export const MigrationMetaTile = ({
  instances,
  runMigration,
  selectFrom,
  fromInstance,
  toInstance,
  selectTo
}) => {
  return (
    <Paper className={classes.container}>
      <h2>Migration</h2>
      <div className={classes.button}>
        <Button raised color="primary" onTouchTap={runMigration}>
          Run Migration
        </Button>
      </div>
      <div className={classes.tiles}>
        <MigrationInstanceTile
          title="From"
          instances={instances}
          selectedInstance={fromInstance}
          selectInstance={selectFrom}
        />
        <MigrationInstanceTile
          title="To"
          instances={instances}
          selectedInstance={toInstance}
          selectInstance={selectTo}
        />
      </div>
    </Paper>
  )
}

MigrationMetaTile.propTypes = {
  instances: PropTypes.object,
  runMigration: PropTypes.func,
  selectFrom: PropTypes.func,
  fromInstance: PropTypes.string,
  toInstance: PropTypes.string,
  selectTo: PropTypes.func
}

export default MigrationMetaTile
