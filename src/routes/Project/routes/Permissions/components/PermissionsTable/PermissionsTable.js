import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { capitalize } from 'lodash'
import { Select } from 'redux-form-material-ui'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import classes from './PermissionsTable.scss'

const resourcesOptions = [
  { value: 'viewer' },
  { value: 'owner' },
  { value: 'editor' }
]

export const PermissionsTable = ({
  collaborators,
  pristine,
  reset,
  handleSubmit
}) => (
  <Paper>
    <div className={classes.table}>
      <div className={classes.header}>
        <span className={classes.headerLeft}>Member</span>
        <span>Role</span>
      </div>
      <form className={classes.body} onSubmit={handleSubmit}>
        {collaborators.map(({ permission, uid, displayName }, index) => (
          <ExpansionPanel key={`${uid}-${permission}`}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.displayName}>
                {displayName || uid}
              </Typography>
              <Typography className={classes.permission}>
                {capitalize(permission)}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ paddingTop: 0 }}>
              <div className={classes.content}>
                <Divider />
                <div>
                  <div className={classes.roleSelect}>
                    <FormControl className={classes.field}>
                      <InputLabel htmlFor="permission">Role</InputLabel>
                      <Field
                        name={`${uid}.permission`}
                        component={Select}
                        fullWidth
                        inputProps={{
                          name: 'permission',
                          id: 'permission'
                        }}>
                        {resourcesOptions.map((option, idx) => (
                          <MenuItem
                            key={`Option-${option.value}-${idx}`}
                            value={option.value}
                            disabled={option.disabled}>
                            <ListItemText
                              primary={option.label || capitalize(option.value)}
                            />
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
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

PermissionsTable.propTypes = {
  collaborators: PropTypes.array.isRequired,
  pristine: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
}

export default PermissionsTable
