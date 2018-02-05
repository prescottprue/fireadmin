import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { Field } from 'redux-form'
import { Select } from 'redux-form-material-ui'
import { FormControl } from 'material-ui/Form'
import { InputLabel } from 'material-ui/Input'
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
  <FormControl className={classes.field}>
    <InputLabel htmlFor="environment">Select An Environment</InputLabel>
    <Field
      name={`${name}.environmentKey`}
      component={Select}
      fullWidth
      inputProps={{
        name: 'environment',
        id: 'environment'
      }}>
      {map(environments, (environment, environmentKey) => (
        <MenuItem key={environmentKey} value={environmentKey}>
          <ListItemText
            primary={environment.name || environmentKey}
            secondary={databaseURLToProjectName(environment.databaseURL)}
          />
        </MenuItem>
      ))}
    </Field>
  </FormControl>
)

ServiceAccountInput.propTypes = {
  environments: PropTypes.object,
  serviceAccounts: PropTypes.object,
  inputMeta: PropTypes.object,
  selectedInstance: PropTypes.string,
  name: PropTypes.string.isRequired
}

export default ServiceAccountInput
