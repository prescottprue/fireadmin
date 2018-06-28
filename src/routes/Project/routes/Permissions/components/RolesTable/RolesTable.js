import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { Checkbox } from 'redux-form-material-ui'
import { map, startCase } from 'lodash'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import classes from './RolesTable.scss'

const roles = {
  viewer: {
    permissions: {
      editPermissions: true
    }
  },
  owner: {
    permissions: {
      editPermissions: true
    }
  },
  editor: {
    permissions: {
      editPermissions: true
    }
  }
}

const resourcesOptions = [
  { value: 'editPermissions' },
  { value: 'editEnvironments' },
  { value: 'editUsers' }
]

export const RolesTable = ({ pristine, reset, handleSubmit }) => (
  <Paper className={classes.container}>
    <div className={classes.table}>
      <div className={classes.header}>
        <span className={classes.headerLeft}>Role</span>
        <span>Permissions</span>
      </div>
      <form className={classes.body} onSubmit={handleSubmit}>
        {map(roles, ({ name, permissions }, roleKey) => (
          <ExpansionPanel key={roleKey}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.displayName}>
                {name || startCase(roleKey)}
              </Typography>
              {map(permissions, (_, permission) => (
                <Typography className={classes.permission} key={permission}>
                  {startCase(permission)}
                </Typography>
              ))}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ paddingTop: 0 }}>
              <div className={classes.content}>
                <Divider />
                <div>
                  <div className={classes.roleSelect}>
                    {resourcesOptions.map((option, idx) => (
                      <FormControlLabel
                        key={`${option.value}-${idx}`}
                        control={
                          <Field
                            name={`permissions.${option.value}`}
                            component={Checkbox}
                          />
                        }
                        label={startCase(option.value)}
                      />
                    ))}
                  </div>
                </div>
                <div className={classes.buttons}>
                  <Button
                    disabled={pristine}
                    color="secondary"
                    aria-label="Run Action"
                    onClick={reset}
                    style={{ marginRight: '2rem' }}>
                    Cancel
                  </Button>
                  <Button
                    disabled={pristine}
                    color="primary"
                    variant="raised"
                    aria-label="Run Action"
                    type="submit">
                    Update Role
                  </Button>
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ))}
      </form>
    </div>
  </Paper>
)

RolesTable.propTypes = {
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
}

export default RolesTable
