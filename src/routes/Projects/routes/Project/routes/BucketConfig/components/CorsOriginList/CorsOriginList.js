import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import { makeStyles } from '@material-ui/core/styles'
import TextField from 'components/FormTextField'
import styles from './CorsOriginList.styles'

const useStyles = makeStyles(styles)

function CorsOriginList({ fields, meta: { error, submitFailed } }) {
  const classes = useStyles()

  return (
    <div style={{ marginBottom: '1rem' }}>
      <Typography variant="h5">Origins</Typography>
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
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired
}

export default CorsOriginList
