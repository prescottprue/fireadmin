import React from 'react'
import { Field } from 'redux-form'
import { TextField, Toggle } from 'redux-form-material-ui'
import Grid from 'material-ui-next/Grid'
import classes from './NewMigrationTemplateForm.scss'

export const NewMigrationTemplateForm = () => (
  <div className={classes.container}>
    <Grid container spacing={24} style={{ flexGrow: 1 }}>
      <Grid item xs={12} lg={3}>
        <Field name="name" component={TextField} floatingLabelText="Name" />
        <Field name="public" component={Toggle} label="Public" />
        <Field
          name="description"
          component={TextField}
          floatingLabelText="Description"
        />
        <Field
          name="tags"
          component={TextField}
          disabled
          floatingLabelText="Tags (seperated by commas)"
        />
      </Grid>
    </Grid>
  </div>
)

export default NewMigrationTemplateForm
