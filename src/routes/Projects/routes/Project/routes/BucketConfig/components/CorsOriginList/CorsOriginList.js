import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import TextField from 'components/FormTextField'

function CorsOriginList({ classes, fields, meta: { error, submitFailed } }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <Typography className={classes.originHeader} variant="h5">
        Origins
      </Typography>
      <div className={classes.add}>
        <Button color="primary" onClick={() => fields.push()}>
          Add Origin
        </Button>
        {submitFailed && error && <span>{error}</span>}
      </div>
      {fields.map((member, index) => (
        <div className="flex-row" key={`Origin-${index}`}>
          <Field
            name={member}
            type="text"
            component={TextField}
            label="Origin"
          />
          {index !== 0 && (
            <IconButton
              onClick={() => fields.remove(index)}
              style={{ marginTop: '1.5rem' }}>
              <DeleteIcon />
            </IconButton>
          )}
        </div>
      ))}
    </div>
  )
}

CorsOriginList.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired
}

export default CorsOriginList
