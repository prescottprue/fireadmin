import React from 'react'
import { get, capitalize } from 'lodash'
import { useFormContext, useFieldArray, Controller } from 'react-hook-form'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ListItemText from '@material-ui/core/ListItemText'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import styles from './ActionTemplateBackups.styles'

const useStyles = makeStyles(styles)

// const pathTypeOptions = [{ value: 'only' }, { value: 'all but' }]
const resourcesOptions = [
  { value: 'rtdb', label: 'Real Time Database' },
  { value: 'firestore' },
  { value: 'storage', label: 'Cloud Storage' }
]

function ActionTemplateBackups() {
  const classes = useStyles()
  const { control, register, watch } = useFormContext()
  const { fields, remove, append } = useFieldArray({
    control,
    name: 'backups' // unique name for your Field Array
  })
  const backups = watch('backups')

  function addBackup() {
    append({ dest: { resource: 'firestore' } })
  }

  return (
    <div>
      <Button
        onClick={addBackup}
        color="primary"
        className={classes.addAction}
        variant="contained">
        Add Backup
      </Button>
      {fields.map((field, index) => {
        function removeBackup() {
          return remove(index)
        }
        return (
          <ExpansionPanel key={index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.title}>
                {get(backups, `${index}.name`) || `Backup ${index + 1}`}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={8} style={{ flexGrow: 1 }}>
                <Grid item xs={10} md={6} lg={6}>
                  <TextField
                    name={`backups[${index}].name`}
                    label="Name"
                    className={classes.field}
                    fullWidth
                    inputRef={register}
                  />
                  <TextField
                    name={`backups[${index}].description`}
                    label="Description"
                    className={classes.field}
                    fullWidth
                    inputRef={register}
                  />
                </Grid>
                <Grid item xs={2} lg={2}>
                  <div className={classes.delete}>
                    <Tooltip placement="bottom" title="Remove Step">
                      <IconButton
                        onClick={removeBackup}
                        color="secondary"
                        className={classes.deleteButton}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Grid>
                <Grid item xs={6} lg={6}>
                  <Typography variant="h5">Source</Typography>
                  <FormControl className={classes.field}>
                    <InputLabel htmlFor="resource">Select Resource</InputLabel>
                    <Controller
                      as={
                        <Select>
                          {resourcesOptions.map((option, idx) => (
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
                      name={`backups[${index}].inputs.0.resource`}
                      control={control}
                      defaultValue=""
                    />
                  </FormControl>
                  <TextField
                    name={`backups[${index}].inputs.0.path`}
                    label="Path"
                    className={classes.field}
                    fullWidth
                    inputRef={register}
                  />
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        )
      })}
    </div>
  )
}

export default ActionTemplateBackups
