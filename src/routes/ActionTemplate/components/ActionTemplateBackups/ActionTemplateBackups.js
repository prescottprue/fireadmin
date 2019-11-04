import React from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'
import { Field } from 'redux-form'
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
import Select from 'components/FormSelectField'
import TextField from 'components/FormTextField'
import styles from './ActionTemplateBackups.styles'

const useStyles = makeStyles(styles)

// const pathTypeOptions = [{ value: 'only' }, { value: 'all but' }]
const resourcesOptions = [
  { value: 'rtdb', label: 'Real Time Database' },
  { value: 'firestore' },
  { value: 'storage', label: 'Cloud Storage' }
]

function ActionTemplateBackups({ fields, steps }) {
  const classes = useStyles()

  function addBackup() {
    return fields.push({ dest: { resource: 'firestore' } })
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
      {fields.map((member, index, field) => {
        function removeBackup() {
          return fields.remove(index)
        }
        return (
          <ExpansionPanel key={index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.title}>
                {fields.get(index).name || fields.get(index).type || 'No Name'}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={8} style={{ flexGrow: 1 }}>
                <Grid item xs={10} md={6} lg={6}>
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
                    <Field
                      name={`${member}.inputs.0.resource`}
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
                  <Field
                    name={`${member}.inputs.0.path`}
                    component={TextField}
                    label="Path"
                    className={classes.field}
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

ActionTemplateBackups.propTypes = {
  fields: PropTypes.object.isRequired,
  steps: PropTypes.array
}

export default ActionTemplateBackups
