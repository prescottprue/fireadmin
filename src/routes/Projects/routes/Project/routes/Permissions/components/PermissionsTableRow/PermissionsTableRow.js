import React from 'react'
import PropTypes from 'prop-types'
import { map, capitalize } from 'lodash'
import { useFirestore, useUser, useFirestoreDocData } from 'reactfire'
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
  uid,
  initialValues
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
  } = useForm({ defaultValues: initialValues })
  const { showSuccess } = useNotifications()
  const user = useUser()

  const projectRef = firestore.doc(`projects/${projectId}`)
  const project = useFirestoreDocData(projectRef)
  const roleOptions = map(project.roles, ({ name }, value) => ({ value, name }))

  async function updatePermission(roleUpdates) {
    await projectRef.set(
      {
        permissions: {
          [uid]: {
            ...roleUpdates,
            updatedAt: FieldValue.serverTimestamp()
          }
        }
      },
      { merge: true }
    )
    // // Write event to project events
    await createProjectEvent(
      { projectId, firestore, FieldValue },
      {
        eventType: 'updatePermission',
        eventData: { ...roleUpdates, userUpdated: uid },
        createdBy: user.uid
      }
    )
    showSuccess('Member updated successfully!')
    triggerAnalyticsEvent('updatePermission', {
      projectId,
      newRole: roleUpdates.role,
      userUpdated: uid
    })
  }

  async function deletePermission() {
    await projectRef.set(
      {
        permissions: {
          [uid]: FieldValue.delete()
        }
      },
      { merge: true }
    )
    // Write event to project events
    await createProjectEvent(
      { projectId, firestore, FieldValue },
      {
        eventType: 'deletePermission',
        eventData: { removedMember: uid },
        createdBy: user.uid
      }
    )
    showSuccess('Member deleted successfully!')
    triggerAnalyticsEvent('removeCollaborator', {
      projectId,
      removedMember: uid
    })
  }

  const closeAndCallDelete = (e) => {
    handleMenuClose()
    deletePermission(e.target)
  }

  return (
    <ExpansionPanel className={classes.root}>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        data-test="member-expand">
        <Typography className={classes.displayName}>
          {displayName || uid}
        </Typography>
        <Typography className={classes.permission}>
          {capitalize(roleKey)}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ paddingTop: 0 }}>
        <form
          className={classes.content}
          onSubmit={handleSubmit(updatePermission)}>
          <Divider />
          <div className={classes.menu}>
            <IconButton
              aria-label="More"
              aria-owns="long-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              data-test={`member-more-${user.uid}`}>
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
                  name="role"
                  control={control}
                  defaultValue={initialValues.role || ''}
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
  projectId: PropTypes.string.isRequired,
  displayName: PropTypes.string,
  roleKey: PropTypes.string,
  uid: PropTypes.string.isRequired
}

export default PermissionsTableRow
