import React from 'react'
import { Field } from 'redux-form'
import { TextField, Switch } from 'redux-form-material-ui'
import Grid from 'material-ui/Grid'
import { FormControlLabel } from 'material-ui/Form'
import classes from './NewActionTemplateForm.scss'

export const NewActionTemplateForm = () => (
  <div className={classes.container}>
    <Grid container spacing={24} style={{ flexGrow: 1 }}>
      <Grid item xs={12} lg={3}>
        <Field name="name" component={TextField} label="Name" />
        <FormControlLabel
          control={<Field name="public" component={Switch} />}
          label="Public"
        />
        <Field name="description" component={TextField} label="Description" />
        <Field
          name="tags"
          component={TextField}
          disabled
          label="Tags (seperated by commas)"
        />
      </Grid>
    </Grid>
  </div>
)

export default NewActionTemplateForm
