import React from 'react'
import PropTypes from 'prop-types'
import { capitalize, get } from 'lodash'
import { Field } from 'redux-form'
import { TextField, Select, RadioGroup } from 'redux-form-material-ui'
import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form'
import { InputLabel } from 'material-ui/Input'
import Radio from 'material-ui/Radio'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel'
import { ListItemText } from 'material-ui/List'
import Typography from 'material-ui/Typography'
import { MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'
import Button from 'material-ui/Button'
import Tooltip from 'material-ui/Tooltip'
import Grid from 'material-ui/Grid'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import DeleteIcon from 'material-ui-icons/Delete'
import ActionEditor from '../ActionEditor'
import classes from './ActionTemplateStep.scss'

const typeOptions = [
  { value: 'copy' },
  { value: 'map', disabled: true },
  { value: 'delete', disabled: true },
  { value: 'custom' }
]
// const pathTypeOptions = [{ value: 'only' }, { value: 'all but' }]
const resourcesOptions = [
  { value: 'rtdb', label: 'Real Time Database' },
  { value: 'firestore' },
  { value: 'storage', label: 'Cloud Storage' }
]

export const ActionTemplateStep = ({
  fields,
  mainEditorPath,
  steps,
  inputs
}) => (
  <div>
    <Button
      onClick={() => fields.push({ type: 'copy', src: { pathType: 'input' } })}
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
                <Grid item xs={12} lg={6}>
                  <h4>Source</h4>
                  <FormControl className={classes.field}>
                    <InputLabel htmlFor="resource">
                      Select A Resource
                    </InputLabel>
                    <Field
                      name={`${member}.src.resource`}
                      component={Select}
                      fullWidth
                      inputProps={{
                        name: 'resource',
                        id: 'resource'
                      }}>
                      {resourcesOptions.map((option, idx) => (
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
                  <FormControl
                    component="fieldset"
                    required
                    className={classes.formControl}
                    style={{ marginTop: '2rem' }}>
                    <FormLabel component="legend">Path Type</FormLabel>
                    <Field
                      component={RadioGroup}
                      name={`${member}.src.pathType`}>
                      <FormControlLabel
                        value="constant"
                        control={<Radio />}
                        label="Constant (part of template)"
                      />
                      <FormControlLabel
                        value="input"
                        control={<Radio />}
                        label="User Input"
                      />
                    </Field>
                  </FormControl>
                  {get(steps, `${index}.src.pathType`) === 'input' ? (
                    <FormControl className={classes.field}>
                      <InputLabel htmlFor="resource">
                        Select An Input
                      </InputLabel>
                      <Field
                        name={`${member}.src.path`}
                        component={Select}
                        fullWidth
                        inputProps={{
                          name: 'pathType',
                          id: 'pathType'
                        }}>
                        {inputs.map((option, idx) => (
                          <MenuItem
                            key={`Option-${option.value}-${idx}`}
                            value={option.value}
                            disabled={option.disabled}>
                            <ListItemText
                              primary={get(
                                option,
                                'variableName',
                                `Input ${idx}`
                              )}
                            />
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  ) : (
                    <Field
                      name={`${member}.src.path`}
                      component={TextField}
                      label="Path"
                      className={classes.field}
                    />
                  )}
                </Grid>
                <Grid item xs={12} lg={6}>
                  <h4>Destination</h4>
                  <FormControl className={classes.field}>
                    <InputLabel htmlFor="destResource">
                      Select A Resource
                    </InputLabel>
                    <Field
                      name={`${member}.dest.resource`}
                      component={Select}
                      fullWidth
                      inputProps={{
                        name: 'destResource',
                        id: 'destResource'
                      }}>
                      {resourcesOptions.map((option, idx) => (
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
                  <FormControl
                    component="fieldset"
                    required
                    className={classes.formControl}
                    style={{ marginTop: '2rem' }}>
                    <FormLabel component="legend">Path Type</FormLabel>
                    <Field
                      component={RadioGroup}
                      name={`${member}.dest.pathType`}>
                      <FormControlLabel
                        value="constant"
                        control={<Radio />}
                        label="Constant (part of template)"
                      />
                      <FormControlLabel
                        value="input"
                        control={<Radio />}
                        label="User Input"
                      />
                    </Field>
                  </FormControl>
                  {get(steps, `${index}.dest.pathType`) === 'input' ? (
                    <FormControl className={classes.field}>
                      <InputLabel htmlFor="resource">
                        Select An Input
                      </InputLabel>
                      <Field
                        name={`${member}.dest.path`}
                        component={Select}
                        fullWidth
                        inputProps={{
                          name: 'pathType',
                          id: 'pathType'
                        }}>
                        {inputs.map((option, idx) => (
                          <MenuItem
                            key={`Option-${option.value}-${idx}`}
                            value={option.value}
                            disabled={option.disabled}>
                            <ListItemText
                              primary={get(
                                option,
                                'variableName',
                                `Input ${idx}`
                              )}
                            />
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  ) : (
                    <Field
                      name={`${member}.dest.path`}
                      component={TextField}
                      label="Path"
                      className={classes.field}
                    />
                  )}
                </Grid>
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
