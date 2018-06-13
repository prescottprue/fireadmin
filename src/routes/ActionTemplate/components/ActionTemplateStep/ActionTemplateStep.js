import React from 'react'
import PropTypes from 'prop-types'
import { capitalize, get } from 'lodash'
import { Field } from 'redux-form'
import { TextField, Select } from 'redux-form-material-ui'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteIcon from '@material-ui/icons/Delete'
import ActionEditor from '../ActionEditor'
import ActionStepLocation from '../ActionStepLocation'
import classes from './ActionTemplateStep.scss'

const typeOptions = [
  { value: 'copy' },
  { value: 'map', disabled: true },
  { value: 'delete', disabled: true },
  { value: 'custom' }
]

export const ActionTemplateStep = ({
  fields,
  mainEditorPath,
  steps,
  inputs
}) => (
  <div>
    <Button
      onClick={() =>
        fields.push({ type: 'copy', src: { pathType: 'userInpu' } })
      }
      color="primary"
      variant="raised"
      className={classes.addAction}>
      Add Step
    </Button>
    {fields.map((member, index, field) => (
      <ExpansionPanel key={index}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.title}>
            {fields.get(index).name || fields.get(index).type}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={24} style={{ flexGrow: 1 }}>
            <Grid item xs={12} lg={12}>
              <Tooltip title="Remove Step">
                <IconButton
                  onClick={() => fields.remove(index)}
                  color="secondary"
                  className={classes.submit}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12} lg={12}>
              <Field
                name={`${member}.name`}
                component={TextField}
                label="Name"
                className={classes.field}
              />
              <Field
                name={`${member}.description`}
                component={TextField}
                label="Description"
                className={classes.field}
              />
              <FormControl
                className={classes.field}
                style={{ marginTop: '2rem' }}>
                <InputLabel htmlFor="actionType">Action Type</InputLabel>
                <Field
                  name={`${member}.type`}
                  component={Select}
                  fullWidth
                  inputProps={{
                    name: 'actionType',
                    id: 'actionType'
                  }}>
                  {typeOptions.map((option, idx) => (
                    <MenuItem
                      key={`Option-${option.value}-${idx}`}
                      value={option.value}
                      disabled={option.disabled}>
                      <ListItemText
                        primary={option.label || capitalize(option.value)}
                      />
                    </MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Grid>
            {get(steps, `${index}.type`) !== 'custom' ? (
              <Grid
                item
                xs={12}
                lg={12}
                container
                spacing={24}
                style={{ flexGrow: 1 }}
                justify="center">
                <ActionStepLocation
                  title="Source"
                  name={`${member}.src`}
                  indexName={`${index}.src`}
                />
                <ActionStepLocation
                  title="Destination"
                  name={`${member}.dest`}
                  indexName={`${index}.dest`}
                />
              </Grid>
            ) : (
              <ActionEditor rtdbPath={`${mainEditorPath}/steps/${index}`} />
            )}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    ))}
  </div>
)

ActionTemplateStep.propTypes = {
  fields: PropTypes.object.isRequired,
  steps: PropTypes.array,
  inputs: PropTypes.array,
  mainEditorPath: PropTypes.string.isRequired
}

export default ActionTemplateStep
