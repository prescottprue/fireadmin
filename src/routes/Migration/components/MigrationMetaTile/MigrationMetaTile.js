import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui-next/Button'
import Paper from 'material-ui/Paper'
import MigrationInstanceTile from '../MigrationInstanceTile'
import classes from './MigrationMetaTile.scss'

export const MigrationMetaTile = ({
  title,
  instances,
  runMigration,
  selectFrom,
  fromInstance,
  toInstance,
  selectTo
}) => (
  <Paper className={classes.container}>
    <h2>Migration</h2>
    <div className={classes.button}>
      <Button raised color="primary" onTouchTap={runMigration}>
        Run Migration
      </Button>
    </div>
    <div className="flex-row-center">
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
    </div>
  </Paper>
)

MigrationMetaTile.propTypes = {
  title: PropTypes.string,
  instances: PropTypes.object,
  runMigration: PropTypes.func,
  selectFrom: PropTypes.func,
  fromInstance: PropTypes.string,
  toInstance: PropTypes.string,
  selectTo: PropTypes.func
}

export default MigrationMetaTile
