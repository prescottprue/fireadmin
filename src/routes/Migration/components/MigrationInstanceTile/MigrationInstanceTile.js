import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Paper from 'material-ui/Paper'
import classes from './MigrationInstanceTile.scss'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

export const MigrationInstanceTile = ({
  title,
  instances,
  selectedInstance,
  selectInstance
}) => (
  <Paper className={classes.container}>
    <h4>{title}</h4>
    <SelectField
      floatingLabelText="Instance"
      value={selectedInstance}
      onChange={selectInstance}>
      {map(instances, (instance, instanceKey) => (
        <MenuItem
          key={instanceKey}
          value={instanceKey}
          primaryText={instance.name || instanceKey}
        />
      ))}
    </SelectField>
  </Paper>
)

MigrationInstanceTile.propTypes = {
  title: PropTypes.string,
  instances: PropTypes.object,
  selectedInstance: PropTypes.string,
  selectInstance: PropTypes.func
}

export default MigrationInstanceTile
