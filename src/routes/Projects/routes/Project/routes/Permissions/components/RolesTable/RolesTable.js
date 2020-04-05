import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get, some, map, orderBy, size } from 'lodash'
import { useFirestore, useAuth, useFirestoreDocData } from 'reactfire'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import DownArrow from '@material-ui/icons/ArrowDownward'
import { makeStyles } from '@material-ui/core/styles'
import useNotifications from 'modules/notification/useNotifications'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'
import RolesTableRow from '../RolesTableRow'
import NewRoleCard from '../NewRoleCard'
import NoRolesFound from './NoRolesFound'
import styles from './RolesTable.styles'

const useStyles = makeStyles(styles)

function RolesTable({ projectId }) {
  const classes = useStyles()
  const [newRoleOpen, changeRoleOpen] = useState()
  const firestore = useFirestore()
  const auth = useAuth()
  const { showError, showSuccess } = useNotifications()
  const projectRef = firestore.doc(`projects/${projectId}`)
  const project = useFirestoreDocData(projectRef)
  const openNewRole = () => changeRoleOpen(true)
  const closeNewRole = () => changeRoleOpen(false)
  const orderedRoles = orderBy(
    map(project.roles, (role, key) => ({ ...role, key })),
    [(role) => size(get(role, 'permissions'))],
    ['desc']
  )

  async function addRole(newRole) {
    const currentRoles = get(project, `roles`, {})
    if (some(currentRoles, { name: newRole.name })) {
      const existsErrMsg = 'Role with that name already exists'
      showError(existsErrMsg)
      throw new Error(existsErrMsg)
    }
    await projectRef.set(
      {
        roles: {
          ...currentRoles,
          [newRole.name]: {
            editPermissions: true
          }
        }
      },
      { merge: true }
    )
    // Write event to project events
    await createProjectEvent(
      { projectId, firestore },
      {
        eventType: 'addRole',
        eventData: { roleKey: newRole.name },
        createdBy: auth.currentUser.uid
      }
    )
    showSuccess('New Role added successfully!')
    triggerAnalyticsEvent('addRole', { projectId })
    closeNewRole()
  }
  const roleOptions = map(project.roles, ({ name }, value) => ({ value, name }))

  return (
    <div className={classes.root}>
      <Typography className={classes.heading}>Roles</Typography>
      <div className={classes.buttons}>
        <Button
          color="primary"
          variant="contained"
          aria-label="Add Role"
          onClick={openNewRole}
          disabled={newRoleOpen}>
          Add Role
        </Button>
      </div>
      <Collapse in={newRoleOpen}>
        <NewRoleCard onRequestClose={closeNewRole} onSubmit={addRole} />
      </Collapse>
      <div className={classes.filter}>
        <DownArrow color="disabled" />
        <Typography className={classes.filterText}># of permissions</Typography>
      </div>
      <div className={classes.rolesTable}>
        {orderedRoles && orderedRoles.length ? (
          orderedRoles.map(({ name, permissions, key }) => (
            <RolesTableRow
              key={key}
              roleKey={key}
              name={name}
              projectId={projectId}
              roleOptions={roleOptions}
              initialValues={permissions}
            />
          ))
        ) : (
          <NoRolesFound />
        )}
      </div>
    </div>
  )
}

RolesTable.propTypes = {
  projectId: PropTypes.string.isRequired
}

export default RolesTable
