import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { Checkbox } from 'redux-form-material-ui'
import { startCase } from 'lodash'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import FormLabel from '@material-ui/core/FormLabel'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DeleteIcon from '@material-ui/icons/Delete'
import DeleteMemberModal from '../DeleteMemberModal'

const resourcesOptions = [
  { value: 'members' },
  { value: 'environments' },
  { value: 'roles' },
  { value: 'permissions' }
]

const editOptions = ['Delete']

const ITEM_HEIGHT = 48

export const RolesTableRow = ({
  name,
  pristine,
  reset,
  handleSubmit,
  roleKey,
  classes,
  handleMenuClick,
  startDelete,
  handleMenuClose,
  deleteDialogOpen,
  handleDeleteClose,
  updateRolesDisabled,
  onDeleteClick,
  anchorEl
}) => (
  <ExpansionPanel key={roleKey}>
    <DeleteMemberModal
      open={deleteDialogOpen}
      name={roleKey}
      onRequestClose={handleDeleteClose}
      onDeleteClick={onDeleteClick}
    />
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography className={classes.heading}>
        {name || startCase(roleKey)}
      </Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
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
            {editOptions.map(option => (
              <MenuItem key={option} onClick={startDelete}>
                <ListItemIcon className={classes.icon}>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.primary }}
                  inset
                  primary="Delete Role"
                />
              </MenuItem>
            ))}
          </Menu>
        </div>
        <Typography
          component="h2"
          className={classes.resourcePermissionsHeader}>
          Resource Permissions
        </Typography>
        <div className={classes.roleSelect}>
          <div className={classes.optionsLabels}>
            {resourcesOptions.map((option, idx) => (
              <FormLabel
                key={`${option.value}-${idx}`}
                className={classes.optionLabel}>
                {startCase(option.value)}
              </FormLabel>
            ))}
          </div>
          <div className={classes.roleOptions}>
            <span>Create</span>
            {resourcesOptions.map((option, idx) => (
              <FormControlLabel
                key={`${option.value}-${idx}`}
                className={classes.roleOption}
                control={
                  <Field
                    name={`createPermissions.${option.value}`}
                    disabled={updateRolesDisabled}
                    component={Checkbox}
                  />
                }
              />
            ))}
          </div>
          <div className={classes.roleOptions}>
            <span>Read</span>
            {resourcesOptions.map((option, idx) => (
              <FormControlLabel
                key={`${option.value}-${idx}`}
                className={classes.roleOption}
                control={
                  <Field
                    name={`readPermissions.${option.value}`}
                    disabled={updateRolesDisabled}
                    component={Checkbox}
                  />
                }
              />
            ))}
          </div>
          <div className={classes.roleOptions}>
            <span>Update</span>
            {resourcesOptions.map((option, idx) => (
              <FormControlLabel
                key={`${option.value}-${idx}`}
                className={classes.roleOption}
                control={
                  <Field
                    name={`updatePermissions.${option.value}`}
                    disabled={updateRolesDisabled}
                    component={Checkbox}
                  />
                }
              />
            ))}
          </div>
          <div className={classes.roleOptions}>
            <span>Delete</span>
            {resourcesOptions.map((option, idx) => (
              <FormControlLabel
                key={`${option.value}-${idx}`}
                className={classes.roleOption}
                control={
                  <Field
                    name={`deletePermissions.${option.value}`}
                    disabled={updateRolesDisabled}
                    component={Checkbox}
                  />
                }
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
            disabled={pristine || updateRolesDisabled}
            color="primary"
            variant="raised"
            aria-label="Run Action"
            type="submit">
            Update Roles
          </Button>
        </div>
      </form>
    </ExpansionPanelDetails>
  </ExpansionPanel>
)

RolesTableRow.propTypes = {
  name: PropTypes.string,
  onDeleteClick: PropTypes.func.isRequired,
  startDelete: PropTypes.func.isRequired,
  updateRolesDisabled: PropTypes.bool.isRequired, // from enhancer (connect)
  anchorEl: PropTypes.object, // from enhancer (withStateHandlers)
  handleMenuClick: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  handleMenuClose: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  deleteDialogOpen: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  handleDeleteClose: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  reset: PropTypes.func.isRequired, // from enhancer (reduxForm)
  roleKey: PropTypes.string.isRequired // from enhancer (reduxForm)
}

export default RolesTableRow
