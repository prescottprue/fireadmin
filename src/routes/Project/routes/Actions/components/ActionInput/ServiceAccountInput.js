import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import { Field } from 'redux-form'
import { SelectField } from 'redux-form-material-ui'
import MenuItem from 'material-ui/MenuItem'
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
      name={`${name}.databaseURL`}
      component={SelectField}
      className={classes.field}
      hintText="Select An Environment"
      floatingLabelText="Environment"
      floatingLabelFixed>
      {map(environments, (environment, environmentKey) => (
        <MenuItem
          key={environmentKey}
          value={environment.databaseURL}
          primaryText={environment.name || environmentKey}
          secondaryText={databaseURLToProjectName(environment.databaseURL)}
        />
      ))}
    </Field>
    <Field
      name={`${name}.serviceAccountPath`}
      component={SelectField}
      className={classes.field}
      hintText="Select A Service Account"
      floatingLabelText="Service Account"
      floatingLabelFixed>
      {map(serviceAccounts, ({ name, fullPath }) => (
        <MenuItem key={name} value={fullPath} primaryText={name} />
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
