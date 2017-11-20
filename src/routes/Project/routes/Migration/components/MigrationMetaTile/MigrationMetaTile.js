import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui-next/Button'
import Paper from 'material-ui-next/Paper'
import MigrationInstanceTile from '../MigrationInstanceTile'
import classes from './MigrationMetaTile.scss'

export const MigrationMetaTile = ({
  runMigration,
  environments,
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
    <div className={classes.tiles}>
      <MigrationInstanceTile
        title="From"
        instances={environments}
        environments={environments}
        selectedInstance={fromInstance}
        selectInstance={selectFrom}
      />
      <MigrationInstanceTile
        title="To"
        instances={environments}
        environments={environments}
        selectedInstance={toInstance}
        selectInstance={selectTo}
      />
    </div>
  </Paper>
)

MigrationMetaTile.propTypes = {
  runMigration: PropTypes.func, // from enhancer
  selectFrom: PropTypes.func, // from enhancer
  environments: PropTypes.object, // from enhancer (flattend from Project)
  fromInstance: PropTypes.string, // from enhancer
  toInstance: PropTypes.string, // from enhancer
  selectTo: PropTypes.func // from enhancer
}

export default MigrationMetaTile
