import React from 'react'
import { useFormContext, useFieldArray } from 'react-hook-form'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
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

function ActionTemplateEnvs() {
  const classes = useStyles()
  const { control, register, watch } = useFormContext()
  const name = 'environments'
  const { fields, remove, append } = useFieldArray({ control, name })
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
        const environment = watch(`${name}[${index}]`)
        return (
          <Accordion key={field.id} data-test="action-template-env">
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.title}>
                {environment?.name || `Environment ${index + 1}`}
              </Typography>
              {environment?.description && (
                <Typography className={classes.type}>
                  {environment?.description.substring(0, 100)}
                </Typography>
              )}
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={8} style={{ flexGrow: 1 }}>
                <Grid item xs={10} md={4} lg={4}>
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
                          defaultChecked={environment.required}
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
            </AccordionDetails>
            <Divider />
          </Accordion>
        )
      })}
    </div>
  )
}

export default ActionTemplateEnvs
