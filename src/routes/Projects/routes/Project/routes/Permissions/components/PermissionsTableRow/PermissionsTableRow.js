import React from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'
import { useFirestore, useAuth } from 'reactfire'
import { Controller } from 'react-hook-form'
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
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DeleteIcon from '@material-ui/icons/Delete'
import { makeStyles } from '@material-ui/core/styles'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'
import useNotifications from 'modules/notification/useNotifications'
import { useForm } from 'react-hook-form'
import styles from './PermissionsTableRow.styles'
import { useState } from 'react'

const useStyles = makeStyles(styles)

const editOptions = ['Delete']
const ITEM_HEIGHT = 48

function PermissionsTableRow({
  displayName,
  projectId,
  roleKey,
  role,
  roleOptions
}) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)
  const handleMenuClick = (e) => setAnchorEl(e.target)
  const handleMenuClose = (e) => setAnchorEl(null)

  const firestore = useFirestore()
  const { FieldValue } = useFirestore
  const {
    reset,
    control,
    handleSubmit,
    formState: { dirty, isSubmitting }
  } = useForm({ defaultValues: role })
  const { showSuccess } = useNotifications()
  const auth = useAuth()

  const projectRef = firestore.doc(`projects/${projectId}`)
  async function updateRole(roleUpdates) {
    await projectRef.set(
      {
        roles: {
          [roleKey]: {
            permissions: roleUpdates
          }
        }
      },
      { merge: true }
    )
    // Write event to project events
    await createProjectEvent(
      { projectId, firestore },
      {
        eventType: 'updateRole',
        eventData: { roleKey },
        createdBy: auth.currentUser.uid
      }
    )
    showSuccess('Role updated successfully!')
    triggerAnalyticsEvent('updateRole', {
      projectId,
      roleName: roleKey
    })
  }

  async function deleteRole(roleKey) {
    await projectRef.set(
      {
        roles: {
          [roleKey]: FieldValue.delete()
        }
      },
      { merge: true }
    )
    // Write event to project events
    await createProjectEvent(
      { projectId, firestore },
      {
        eventType: 'deleteRole',
        eventData: { roleKey: roleKey },
        createdBy: auth.currentUser.uid
      }
    )
    showSuccess('Role deleted successfully!')
    triggerAnalyticsEvent('deleteRole', { projectId, roleKey })
  }

  const closeAndCallDelete = (e) => {
    handleMenuClose()
    deleteRole()
  }

  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        data-test="member-expand">
        <Typography className={classes.displayName}>
          {displayName || auth.currentUser.uid}
        </Typography>
        <Typography className={classes.permission}>
          {capitalize(role)}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ paddingTop: 0 }}>
        <form className={classes.content} onSubmit={handleSubmit(updateRole)}>
          <Divider />
          <div className={classes.menu}>
            <IconButton
              aria-label="More"
              aria-owns="long-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              data-test={`member-more-${auth.currentUser.uid}`}>
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
                <MenuItem
                  key={option}
                  onClick={closeAndCallDelete}
                  data-test="member-delete">
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
                <Controller
                  as={
                    <Select fullWidth>
                      {roleOptions.map((option, idx) => (
                        <MenuItem
                          key={`Role-Option-${option.value}-${idx}`}
                          value={option.value}
                          disabled={option.disabled}
                          data-test={`role-option-${option.value}`}>
                          <ListItemText
                            primary={option.name || capitalize(option.value)}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  }
                  name="environment"
                  control={control}
                  defaultValue=""
                />
              </FormControl>
            </div>
          </div>
          <div className={classes.buttons}>
            <Button
              disabled={!dirty || isSubmitting}
              color="secondary"
              aria-label="Cancel"
              onClick={reset}
              style={{ marginRight: '2rem' }}>
              Cancel
            </Button>
            <Button
              disabled={!dirty || isSubmitting}
              color="primary"
              variant="contained"
              aria-label="Update Member"
              type="submit"
              data-test="update-member-button">
              {isSubmitting ? 'Updating...' : 'Update Member'}
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
