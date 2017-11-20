import React from 'react'
import PropTypes from 'prop-types'
import { map, get } from 'lodash'
import Paper from 'material-ui/Paper'
import classes from './MigrationInstanceTile.scss'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'

const databaseURLToProjectName = databaseURL =>
  databaseURL.replace('https://', '').replace('.firebaseio.com', '')

export const MigrationInstanceTile = ({
  title,
  environments,
  selectedInstance,
  selectInstance
}) => (
  <Paper className={classes.container}>
    <h4>{title}</h4>
    {selectedInstance ? (
      <div>
        {databaseURLToProjectName(
          get(environments, `${selectedInstance}.databaseURL`)
        )}
      </div>
    ) : null}
    <SelectField
      floatingLabelText="Instance"
      value={selectedInstance}
      onChange={selectInstance}>
      {map(environments, (environment, environmentKey) => (
        <MenuItem
          key={environmentKey}
          value={environmentKey}
          primaryText={environment.name || environmentKey}
          secondaryText={databaseURLToProjectName(environment.databaseURL)}
        />
      ))}
    </SelectField>
  </Paper>
)

MigrationInstanceTile.propTypes = {
  title: PropTypes.string,
  environments: PropTypes.object,
  selectedInstance: PropTypes.string,
  selectInstance: PropTypes.func
}

export default MigrationInstanceTile
