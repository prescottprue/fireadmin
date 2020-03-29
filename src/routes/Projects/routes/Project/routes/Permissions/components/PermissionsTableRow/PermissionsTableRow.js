import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { capitalize } from 'lodash'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DeleteIcon from '@material-ui/icons/Delete'
import Select from 'components/FormSelectField'

const editOptions = ['Delete']

const ITEM_HEIGHT = 48

function PermissionsTableRow({
  pristine,
  reset,
  displayName,
  uid,
  role,
  roleOptions,
  classes,
  handleSubmit,
  handleMenuClose,
  handleMenuClick,
  closeAndCallDelete,
  anchorEl
}) {
  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.displayName}>
          {displayName || uid}
        </Typography>
        <Typography className={classes.permission}>
          {capitalize(role)}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ paddingTop: 0 }}>
        <form className={classes.content} onSubmit={handleSubmit}>
          <Divider />
          <div className={classes.menu}>
            <IconButton
              aria-label="More"
              aria-owns="long-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: 200
                }
              }}>
              {editOptions.map((option) => (
                <MenuItem key={option} onClick={closeAndCallDelete}>
                  <ListItemIcon className={classes.icon}>
                    <DeleteIcon />
                  </ListItemIcon>
                  <ListItemText
                    classes={{ primary: classes.primary }}
                    primary="Delete Member"
                  />
                </MenuItem>
              ))}
            </Menu>
          </div>
          <div>
            <div className={classes.roleSelect}>
              <FormControl className={classes.field}>
                <InputLabel htmlFor="role">Role</InputLabel>
                <Field
                  name={`${uid}.role`}
                  component={Select}
                  fullWidth
                  inputProps={{
                    name: 'role',
                    id: 'role'
                  }}>
                  {roleOptions.map((option, idx) => (
                    <MenuItem
                      key={`Role-Option-${option.value}-${idx}`}
                      value={option.value}
                      disabled={option.disabled}>
                      <ListItemText
                        primary={option.name || capitalize(option.value)}
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
              aria-label="Cancel"
              onClick={reset}
              style={{ marginRight: '2rem' }}>
              Cancel
            </Button>
            <Button
              disabled={pristine}
              color="primary"
              variant="contained"
              aria-label="Update Member"
              type="submit">
              Update Member
            </Button>
          </div>
        </form>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

PermissionsTableRow.propTypes = {
  displayName: PropTypes.string,
  uid: PropTypes.string.isRequired,
  role: PropTypes.string,
  roleOptions: PropTypes.array,
  closeAndCallDelete: PropTypes.func.isRequired,
  anchorEl: PropTypes.object, // from enhancer (withStateHandlers)
  handleMenuClick: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  handleMenuClose: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  reset: PropTypes.func.isRequired // from enhancer (reduxForm)
}

export default PermissionsTableRow
