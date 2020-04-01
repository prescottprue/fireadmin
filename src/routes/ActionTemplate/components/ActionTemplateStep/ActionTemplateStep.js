import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { capitalize, get } from 'lodash'
import { useFormContext, useFieldArray, Controller } from 'react-hook-form'
import FormControlLabel from '@material-ui/core/FormControlLabel'
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
import { makeStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'
import ActionEditor from '../ActionEditor'
import ActionStepLocation from '../ActionStepLocation'
import styles from './ActionTemplateStep.styles'

const useStyles = makeStyles(styles)

const typeOptions = [
  { value: 'copy' },
  { value: 'map', disabled: true },
  { value: 'delete', disabled: true },
  { value: 'custom', disabled: true }
]

function ActionTemplateStep({ mainEditorPath, addStepClick, inputs }) {
  const classes = useStyles()
  const { control, register, watch } = useFormContext()
  const name = 'step'
  const { fields, remove } = useFieldArray({ control, name })
  const steps = watch(name)

  return (
    <div>
      <Button
        onClick={addStepClick}
        color="primary"
        variant="contained"
        className={classes.addAction}>
        Add Step
      </Button>
      {fields.map((field, index) => {
        function removeStep() {
          return remove(index)
        }
        return (
          <ExpansionPanel key={index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.title}>
                {get(steps, `${index}.name`) || `Backup ${index + 1}`}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={8} style={{ flexGrow: 1 }}>
                <Grid
                  item
                  xs={10}
                  md={6}
                  lg={6}
                  className={classes.alignCenter}>
                  <TextField
                    name={`${name}[${index}].name`}
                    label="Name"
                    className={classes.field}
                    fullWidth
                    inputRef={register}
                  />
                  <br />
                  <FormControl
                    className={classes.field}
                    style={{ textAlign: 'left' }}>
                    <InputLabel htmlFor="actionType">Action Type</InputLabel>
                    <Controller
                      as={
                        <Select fullWidth>
                          {typeOptions.map((option, idx) => (
                            <MenuItem
                              key={`Option-${option.value}-${idx}`}
                              value={option.value}
                              disabled={option.disabled}>
                              <ListItemText
                                primary={
                                  option.label || capitalize(option.value)
                                }
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      }
                      name={`${name}[${index}].type`}
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                  <br />
                  <TextField
                    name={`${name}[${index}].description`}
                    label="Description"
                    className={classes.field}
                    fullWidth
                    inputRef={register}
                  />
                </Grid>
                <Grid item xs={2} lg={1}>
                  <div className={classes.delete}>
                    <Tooltip placement="bottom" title="Remove Step">
                      <IconButton
                        onClick={removeStep}
                        color="secondary"
                        className={classes.deleteButton}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Grid>
                <Grid item xs={12} lg={12}>
                  {get(steps, `${index}.type`) === 'copy' ? (
                    <FormControlLabel
                      control={
                        <Checkbox
                          name={`steps.${index}.disableBatching`}
                          disabled={
                            get(steps, `${index}.src.resource`) !== 'rtdb'
                          }
                          inputRef={register}
                        />
                      }
                      label="Disable Batching (only RTDB)"
                      className={classes.subcollectionOption}
                    />
                  ) : null}
                  {get(steps, `${index}.type`) === 'copy' ? (
                    <Fragment>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="subcollections"
                            disabled={
                              get(steps, `${index}.src.resource`) !==
                              'firestore'
                            }
                            inputRef={register}
                          />
                        }
                        label="Include subcollections (only Firestore)"
                        className={classes.subcollectionOption}
                      />
                      <Typography style={{ marginTop: '1rem' }}>
                        <strong>Note:</strong>
                        <br />
                        All collections will by copied by default. Specific
                        subcollection support coming soon.
                      </Typography>
                    </Fragment>
                  ) : null}
                </Grid>
                {get(steps, `${index}.type`) !== 'custom' ? (
                  <Grid item xs={12} lg={12}>
                    <Grid
                      container
                      spacing={8}
                      style={{ flexGrow: 1 }}
                      justify="center">
                      <ActionStepLocation
                        title="Source"
                        name={`${name}[${index}].src`}
                        indexName={`${index}.src`}
                      />
                      <ActionStepLocation
                        title="Destination"
                        name={`${name}[${index}].dest`}
                        indexName={`${index}.dest`}
                      />
                    </Grid>
                  </Grid>
                ) : (
                  <ActionEditor rtdbPath={`${mainEditorPath}/steps/${index}`} />
                )}
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      })}
    </div>
  )
}

ActionTemplateStep.propTypes = {
  fields: PropTypes.object.isRequired,
  addStepClick: PropTypes.func.isRequired,
  steps: PropTypes.array,
  inputs: PropTypes.array,
  mainEditorPath: PropTypes.string.isRequired
}

export default ActionTemplateStep
