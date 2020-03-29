import React from 'react'
import { Field } from 'redux-form'
import TextField from 'components/FormTextField'
import { makeStyles } from '@material-ui/core/styles'
import FormSwitchField from 'components/FormSwitchField'

const useStyles = makeStyles((theme) => ({
  field: theme.field
}))

function NewActionTemplateForm() {
  const classes = useStyles()
  return (
    <div>
      <Field
        name="name"
        component={(props) => <TextField {...props} />}
        label="Name"
        className={classes.field}
      />
      <Field
        name="public"
        label="Public"
        className={classes.field}
        component={FormSwitchField}
      />
      <Field
        name="description"
        component={(props) => <TextField {...props} />}
        label="Description"
        className={classes.field}
      />
      <Field
        name="tags"
        component={(props) => <TextField {...props} />}
        className={classes.field}
        style={{ marginTop: '2rem' }}
        disabled
        label="Tags (seperated by commas)"
      />
    </div>
  )
}

export default NewActionTemplateForm
