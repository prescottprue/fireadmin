import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { Field } from 'redux-form'
import { Select } from 'redux-form-material-ui'
import { MenuItem } from 'material-ui/Menu'
import { ListItemText } from 'material-ui/List'
import { databaseURLToProjectName } from 'utils'
import classes from './ActionInput.scss'

export const ServiceAccountInput = ({
  name,
  inputMeta,
  environments,
  serviceAccounts,
  selectedInstance
}) => (
  <div>
    <Field
      name={`${name}.environmentKey`}
      component={Select}
      className={classes.field}
      hintText="Select An Environment"
      label="Environment"
      floatingLabelFixed>
      {map(environments, (environment, environmentKey) => (
        <MenuItem key={environmentKey} value={environmentKey}>
          <ListItemText
            primary={environment.name || environmentKey}
            secondary={databaseURLToProjectName(environment.databaseURL)}
          />
        </MenuItem>
      ))}
    </Field>
  </div>
)

ServiceAccountInput.propTypes = {
  environments: PropTypes.object,
  serviceAccounts: PropTypes.object,
  inputMeta: PropTypes.object,
  selectedInstance: PropTypes.string,
  name: PropTypes.string.isRequired
}

export default ServiceAccountInput
