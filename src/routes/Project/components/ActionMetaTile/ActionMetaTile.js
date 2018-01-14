import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui-next/Button'
import Paper from 'material-ui-next/Paper'
import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { required } from 'utils/form'
import ActionInstanceTile from '../ActionInstanceTile'
import classes from './ActionMetaTile.scss'

export const ActionMetaTile = ({
  environments,
  runAction,
  selectFrom,
  fromInstance,
  toInstance,
  selectTo,
  handleSubmit
}) => {
  return (
    <Paper className={classes.container}>
      <form onSubmit={handleSubmit}>
        <h2>Action</h2>
        <div className={classes.button}>
          <Button raised color="primary" type="submit">
            Run Action
          </Button>
        </div>
        <div>
          <Field
            component={TextField}
            name="path"
            floatingLabelText="Sync Path"
            validate={required}
          />
        </div>
        <div className={classes.tiles}>
          <ActionInstanceTile
            title="From"
            environments={environments}
            selectedInstance={fromInstance}
            selectInstance={selectFrom}
          />
          <ActionInstanceTile
            title="To"
            environments={environments}
            selectedInstance={toInstance}
            selectInstance={selectTo}
          />
        </div>
      </form>
    </Paper>
  )
}

ActionMetaTile.propTypes = {
  environments: PropTypes.object,
  runAction: PropTypes.func,
  selectFrom: PropTypes.func,
  fromInstance: PropTypes.string,
  toInstance: PropTypes.string,
  selectTo: PropTypes.func,
  handleSubmit: PropTypes.func
}

export default ActionMetaTile
