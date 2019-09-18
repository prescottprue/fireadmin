import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Field } from 'redux-form'
import OutlinedTextField from 'components/OutlinedTextField'
import classes from './ActionInput.scss'

export const ActionInput = ({ inputMeta, name, index }) => (
  <Field
    name={name}
    props={{
      label: get(inputMeta, `name`) || `Input ${index + 1}`,
      'data-test': 'action-input'
    }}
    component={OutlinedTextField}
    className={classes.field}
  />
)

ActionInput.propTypes = {
  inputMeta: PropTypes.object,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired // eslint-disable-line react/no-unused-prop-types
}

export default ActionInput
