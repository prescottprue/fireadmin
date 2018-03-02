import React from 'react'
import PropTypes from 'prop-types'
import { get, startCase } from 'lodash'
import { Field } from 'redux-form'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel'
import Typography from 'material-ui/Typography'
import { TextField } from 'redux-form-material-ui'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import ServiceAccountInput from './ServiceAccountInput'
import classes from './ActionInput.scss'

export const ActionInput = ({
  inputMeta,
  name,
  index,
  inputs,
  environments,
  selectedInstance,
  serviceAccounts,
  selectInstance
}) => (
  <ExpansionPanel defaultExpanded className={classes.container}>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <div style={{ display: 'block' }}>
        <Typography className={classes.title}>
          {get(inputMeta, `name`) || `Input ${index + 1}`}
        </Typography>
        {get(inputMeta, `type`, null) && (
          <Typography className={classes.type}>
            Type: {startCase(get(inputMeta, `type`))}
          </Typography>
        )}
      </div>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      {get(inputMeta, 'type') === 'serviceAccount' ? (
        <ServiceAccountInput
          name={name}
          inputMeta={inputMeta}
          environments={environments}
          inputs={inputs}
          serviceAccounts={serviceAccounts}
          selectedInstance={selectedInstance}
        />
      ) : (
        <Field
          name={name}
          component={TextField}
          label="Name"
          className={classes.field}
        />
      )}
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

ActionInput.propTypes = {
  environments: PropTypes.object,
  inputs: PropTypes.array,
  inputMeta: PropTypes.object,
  index: PropTypes.number.isRequired,
  serviceAccounts: PropTypes.object,
  selectedInstance: PropTypes.string,
  name: PropTypes.string.isRequired,
  selectInstance: PropTypes.func
}

export default ActionInput
