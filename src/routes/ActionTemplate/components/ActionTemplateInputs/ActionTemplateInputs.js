import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Field } from 'redux-form'
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
import TextField from 'components/FormTextField'
import Switch from 'components/FormSwitchField'
import styles from './ActionTemplateInputs.styles'

const useStyles = makeStyles(styles)

function ActionTemplateInputs({ fields, inputs }) {
  const classes = useStyles()

  function addNewInput() {
    return fields.push({ required: false })
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
      {fields.map((member, index, field) => {
        function removeInput() {
          return fields.remove(index)
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
                  <div className={classes.required}>
                    <Field
                      name={`${member}.required`}
                      component={Switch}
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
                    <Field
                      name={`${member}.variableName`}
                      component={TextField}
                      label="Variable Name"
                      className={classes.field}
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
  fields: PropTypes.object.isRequired,
  inputs: PropTypes.array
}

export default ActionTemplateInputs
