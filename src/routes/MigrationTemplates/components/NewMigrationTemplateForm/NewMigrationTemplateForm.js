import React from 'react'
import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import classes from './NewMigrationTemplateForm.scss'

export const NewMigrationTemplateForm = () => (
  <div className={classes.container}>
    <Field name="name" component={TextField} floatingLabelText="Name" />
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
  </div>
)

export default NewMigrationTemplateForm
