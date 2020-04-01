import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { useFormContext, useFieldArray } from 'react-hook-form'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch'
import styles from './ActionTemplateEnvs.styles'

const useStyles = makeStyles(styles)

function ActionTemplateEnvs({ environments }) {
  const classes = useStyles()
  const { control, register } = useFormContext()
  const { fields, remove, append } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'environments' // unique name for your Field Array
  })
  function addNewEnvironment() {
    return append({ required: false })
  }

  return (
    <div>
      <Button
        onClick={addNewEnvironment}
        color="primary"
        className={classes.addAction}
        variant="contained">
        Add Environment
      </Button>
      {fields.map((field, index) => {
        function removeEnvironment() {
          return remove(index)
        }
        return (
          <ExpansionPanel key={field.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.title}>
                {get(environments, `${index}.name`) ||
                  `Environment ${index + 1}`}
              </Typography>
              {get(environments, `${index}.description`, null) && (
                <Typography className={classes.type}>
                  {get(environments, `${index}.description`).substring(0, 100)}
                </Typography>
              )}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={8} style={{ flexGrow: 1 }}>
                <Grid item xs={10} md={4} lg={4}>
                  <TextField
                    name={`environments[${index}].name`}
                    label="Name"
                    className={classes.field}
                    fullWidth
                    inputRef={register}
                  />
                  <TextField
                    name={`environments[${index}].description`}
                    label="Description"
                    className={classes.field}
                    fullWidth
                    inputRef={register}
                  />
                  <div className={classes.required}>
                    <FormControlLabel
                      control={
                        <Switch
                          name={`environments[${index}].required`}
                          inputRef={register}
                        />
                      }
                      label="Required"
                    />
                  </div>
                </Grid>
                <Grid item xs={2} lg={1}>
                  <div className={classes.delete}>
                    <Tooltip placement="bottom" title="Remove Environment">
                      <IconButton
                        onClick={removeEnvironment}
                        className={classes.deleteButton}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
            <Divider />
          </ExpansionPanel>
        )
      })}
    </div>
  )
}

ActionTemplateEnvs.propTypes = {
  environments: PropTypes.array
}

export default ActionTemplateEnvs
