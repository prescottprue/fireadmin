import React from 'react'
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

function ActionTemplateInputs() {
  const classes = useStyles()
  const { control, register, watch } = useFormContext()
  const name = 'inputs'
  const { fields, remove, append } = useFieldArray({ control, name })

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
        const input = watch(`${name}[${index}]`)
        return (
          <ExpansionPanel key={index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.title}>
                {input?.name || `Input ${index + 1}`}
              </Typography>
              {input?.description && (
                <Typography className={classes.type}>
                  {input.description.substring(0, 100)}
                </Typography>
              )}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container spacing={8} style={{ flexGrow: 1 }}>
                <Grid item xs={10} md={6} lg={4}>
                  <TextField
                    name={`${name}[${index}].name`}
                    label="Name"
                    className={classes.field}
                    fullWidth
                    inputRef={register}
                  />
                  <TextField
                    name={`${name}[${index}].description`}
                    label="Description"
                    className={classes.field}
                    fullWidth
                    inputRef={register}
                  />
                  <div className={classes.required}>
                    <FormControlLabel
                      control={
                        <Switch
                          name={`${name}[${index}].required`}
                          inputRef={register}
                          defaultChecked={input?.required}
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
                  {input?.type === 'userInput' && (
                    <TextField
                      name={`${name}[${index}].variableName`}
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

export default ActionTemplateInputs
