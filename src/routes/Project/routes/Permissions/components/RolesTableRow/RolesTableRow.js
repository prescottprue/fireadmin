import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { Checkbox } from 'redux-form-material-ui'
import { startCase } from 'lodash'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const resourcesOptions = [
  { value: 'editPermissions' },
  { value: 'editEnvironments' },
  { value: 'editUsers' }
]

export const RolesTableRow = ({
  name,
  pristine,
  reset,
  handleSubmit,
  roleKey,
  classes
}) => (
  <ExpansionPanel key={roleKey}>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography className={classes.displayName}>
        {name || startCase(roleKey)}
      </Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <form className={classes.content} onSubmit={handleSubmit}>
        <Divider />
        <div className={classes.roleSelect}>
          {resourcesOptions.map((option, idx) => (
            <FormControlLabel
              key={`${option.value}-${idx}`}
              control={
                <Field
                  name={`${roleKey}.permissions.${option.value}`}
                  component={Checkbox}
                />
              }
              label={startCase(option.value)}
            />
          ))}
        </div>
        <div className={classes.buttons}>
          <Button
            disabled={pristine}
            color="secondary"
            aria-label="Run Action"
            onClick={reset}
            style={{ marginRight: '2rem' }}>
            Cancel
          </Button>
          <Button
            disabled={pristine}
            color="primary"
            variant="raised"
            aria-label="Run Action"
            type="submit">
            Update Roles
          </Button>
        </div>
      </form>
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

RolesTableRow.propTypes = {
  name: PropTypes.string,
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  reset: PropTypes.func.isRequired, // from enhancer (reduxForm)
  roleKey: PropTypes.string.isRequired // from enhancer (reduxForm)
}

export default RolesTableRow
