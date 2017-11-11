import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Button from 'material-ui-next/Button'
import Paper from 'material-ui-next/Paper'
import Input from 'material-ui-next/Input'
import { FormControl } from 'material-ui-next/Form'
import { MenuItem } from 'material-ui-next/Menu'
import Select from 'material-ui-next/Select'
import MigrationInstanceTile from '../MigrationInstanceTile'
import classes from './MigrationMetaTile.scss'

export const MigrationMetaTile = ({
  title,
  instances,
  runMigration,
  selectFrom,
  projects,
  selectProject,
  selectedProjectKey,
  serviceAccounts,
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
    <FormControl className={classes.formControl}>
      <Select
        value={selectedProjectKey}
        onChange={selectProject}
        input={<Input id="age-simple" />}>
        {map(projects, (project, key) => (
          <MenuItem value={key} key={key}>
            {project.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
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

MigrationMetaTile.propTypes = {
  title: PropTypes.string,
  instances: PropTypes.object,
  runMigration: PropTypes.func,
  selectFrom: PropTypes.func,
  fromInstance: PropTypes.string,
  serviceAccounts: PropTypes.object,
  projects: PropTypes.object,
  selectProject: PropTypes.func,
  selectedProjectKey: PropTypes.string,
  toInstance: PropTypes.string,
  selectTo: PropTypes.func
}

export default MigrationMetaTile
