import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { Field } from 'redux-form'
import { TextField, Switch } from 'redux-form-material-ui'
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DeleteIcon from '@material-ui/icons/Delete'
import classes from './ActionTemplateEnvs.scss'

function ActionTemplateEnvs({ fields, environments }) {
  return (
    <div>
      <Button
        onClick={() => fields.push({ required: false })}
        color="primary"
        className={classes.addAction}
        variant="contained">
        Add Environment
      </Button>
      {fields.map((member, index, field) => (
        <ExpansionPanel key={index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.title}>
              {get(environments, `${index}.name`) || `Environment ${index + 1}`}
            </Typography>
            {get(environments, `${index}.description`, null) && (
              <Typography className={classes.type}>
                {get(environments, `${index}.description`).substring(0, 100)}
              </Typography>
            )}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container spacing={24} style={{ flexGrow: 1 }}>
              <Grid item xs={10} lg={2}>
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
                  <FormControlLabel
                    control={
                      <Field name={`${member}.required`} component={Switch} />
                    }
                    label="Required"
                  />
                </div>
              </Grid>
              <Grid item xs={2} lg={1}>
                <div className={classes.delete}>
                  <Tooltip placement="bottom" title="Remove Environment">
                    <IconButton
                      onClick={() => fields.remove(index)}
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
      ))}
    </div>
  )
}

ActionTemplateEnvs.propTypes = {
  fields: PropTypes.object.isRequired,
  environments: PropTypes.array
}

export default ActionTemplateEnvs
