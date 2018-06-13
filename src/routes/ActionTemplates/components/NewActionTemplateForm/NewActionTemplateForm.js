import React from 'react'
import { Field } from 'redux-form'
import { TextField, Switch } from 'redux-form-material-ui'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import classes from './NewActionTemplateForm.scss'

export const NewActionTemplateForm = () => (
  <div className={classes.container}>
    <Field
      name="name"
      component={TextField}
      label="Name"
      className={classes.field}
    />
    <FormControlLabel
      control={<Field name="public" component={Switch} />}
      className={classes.field}
      label="Public"
    />
    <Field
      name="description"
      component={TextField}
      label="Description"
      className={classes.field}
    />
    <Field
      name="tags"
      component={TextField}
      className={classes.field}
      style={{ marginTop: '2rem' }}
      disabled
      label="Tags (seperated by commas)"
    />
  </div>
)

export default NewActionTemplateForm
