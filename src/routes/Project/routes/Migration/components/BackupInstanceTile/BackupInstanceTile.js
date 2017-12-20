import React from 'react'
import PropTypes from 'prop-types'
import { map, get } from 'lodash'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
// import classes from './BackupInstanceTile.scss'

const databaseURLToProjectName = databaseURL =>
  databaseURL.replace('https://', '').replace('.firebaseio.com', '')

const resourcesOptions = [
  { text: 'Firebase RTDB', value: 'firebase' },
  { text: 'Firestore', value: 'firestore' },
  { text: 'Google Cloud Storage', value: 'storage', srcDisabled: true }
]

export const BackupInstanceTile = ({
  title,
  environments,
  selectedInstance,
  selectInstance,
  selectResource,
  selectedResource
}) => (
  <Card style={{ width: '45%', marginTop: '2rem' }}>
    <CardTitle title={title} />
    <CardText>
      {selectedInstance ? (
        <div>
          {databaseURLToProjectName(
            get(environments, `${selectedInstance}.databaseURL`)
          )}
        </div>
      ) : null}
      <SelectField
        floatingLabelText="Project"
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
      <SelectField
        floatingLabelText="Resource"
        value={selectedInstance}
        onChange={selectResource}>
        {resourcesOptions.map((option, ind) => (
          <MenuItem
            key={`Resource-Option-${ind}`}
            value={option.value}
            disabled={title === 'Source' && option.srcDisabled}
            primaryText={option.text || option.value}
          />
        ))}
      </SelectField>
    </CardText>
  </Card>
)

BackupInstanceTile.propTypes = {
  title: PropTypes.string,
  environments: PropTypes.object,
  selectedInstance: PropTypes.string,
  selectInstance: PropTypes.func,
  selectedResource: PropTypes.string,
  selectResource: PropTypes.func
}

export default BackupInstanceTile
