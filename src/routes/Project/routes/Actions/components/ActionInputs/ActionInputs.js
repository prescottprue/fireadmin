import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import ActionInput from '../ActionInput'

export const ActionInputs = ({
  fields,
  inputs,
  name,
  projectId,
  environments,
  serviceAccounts
}) => (
  <div className="flex-column">
    {fields.map((member, index, field) => (
      <ActionInput
        key={index}
        name={`${name}.${member}`}
        inputMeta={get(inputs, index)}
        {...{
          index,
          inputs,
          serviceAccounts,
          environments,
          projectId
        }}
      />
    ))}
  </div>
)

ActionInputs.propTypes = {
  fields: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  name: PropTypes.string.isRequired,
  environments: PropTypes.object,
  serviceAccounts: PropTypes.object, // from enhancer (firebaseConenct + connect)
  inputs: PropTypes.array.isRequired
}

export default ActionInputs
