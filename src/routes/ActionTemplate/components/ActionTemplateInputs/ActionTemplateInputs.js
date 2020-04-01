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
import styles from './ActionTemplateInputs.styles'

const useStyles = makeStyles(styles)

function ActionTemplateInputs({ inputs }) {
  const classes = useStyles()
  const { control, register } = useFormContext()
  const { fields, remove, append } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: 'inputs' // unique name for your Field Array
  })

  function addNewInput() {
    append({ required: false })
  }

  return (
    <div>
      <Button
        onClick={addNewInput}
        color="primary"
        className={classes.addAction}
        variant="contained">
        Add Input
      </Button>
      {fields.map((field, index) => {
        function removeInput() {
          return remove(index)
        }
        return (
          <ExpansionPanel key={index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.title}>
                {get(inputs, `${index}.name`) || `Input ${index + 1}`}
              </Typography>
              {get(inputs, `${index}.description`, null) && (
                <Typography className={classes.type}>
                  {get(inputs, `${index}.description`).substring(0, 100)}
                </Typography>
              )}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={8} style={{ flexGrow: 1 }}>
                <Grid item xs={10} md={6} lg={4}>
                  <TextField
                    name={`inputs[${index}].name`}
                    label="Name"
                    className={classes.field}
                    fullWidth
                    inputRef={register}
                  />
                  <TextField
                    name={`inputs[${index}].description`}
                    label="Description"
                    className={classes.field}
                    fullWidth
                    inputRef={register}
                  />
                  <div className={classes.required}>
                    <FormControlLabel
                      control={
                        <Switch
                          name={`inputs[${index}].required`}
                          inputRef={register}
                        />
                      }
                      label="Required"
                    />
                  </div>
                </Grid>
                <Grid item xs={2} lg={1}>
                  <div className={classes.delete}>
                    <Tooltip placement="bottom" title="Remove Input">
                      <IconButton
                        onClick={removeInput}
                        color="secondary"
                        className={classes.deleteButton}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Grid>
                <Grid item xs={6} lg={2}>
                  {get(inputs, `${index}.type`) === 'userInput' && (
                    <TextField
                      name={`inputs[${index}].variableName`}
                      label="Variable Name"
                      className={classes.field}
                      fullWidth
                      inputRef={register}
                    />
                  )}
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

ActionTemplateInputs.propTypes = {
  inputs: PropTypes.array
}

export default ActionTemplateInputs
