import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { some, map, orderBy, size } from 'lodash'
import { useFirestore, useUser, useFirestoreDocData } from 'reactfire'
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
import { createPermissionGetter } from 'utils/data'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'

const useStyles = makeStyles(styles)

function RolesTable({ projectId }) {
  const classes = useStyles()
  const [newRoleOpen, changeRoleOpen] = useState()
  const firestore = useFirestore()
  const { FieldValue } = useFirestore
  const user = useUser()
  const { showError, showSuccess } = useNotifications()
  const projectRef = firestore.doc(`${PROJECTS_COLLECTION}/${projectId}`)
  const project = useFirestoreDocData(projectRef)
  const openNewRole = () => changeRoleOpen(true)
  const closeNewRole = () => changeRoleOpen(false)
  const orderedRoles = orderBy(
    map(project.roles, (role, key) => ({ ...role, key })),
    [(role) => size(role?.permissions)],
    ['desc']
  )

  async function addRole(newRole) {
    const currentRoles = project?.roles || {}
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
      { projectId, firestore, FieldValue },
      {
        eventType: 'addRole',
        eventData: { roleKey: newRole.name },
        createdBy: user.uid
      }
    )
    showSuccess('New Role added successfully!')
    triggerAnalyticsEvent('addRole', { projectId })
    closeNewRole()
  }
  const roleOptions = map(project.roles, ({ name }, value) => ({ value, name }))
  const userHasPermission = createPermissionGetter(project, user.uid)
  return (
    <div className={classes.root}>
      <Typography className={classes.heading}>Roles</Typography>
      <div className={classes.buttons}>
        <Button
          color="primary"
          variant="contained"
          aria-label="Add Role"
          onClick={openNewRole}
          disabled={!userHasPermission('create.roles')}>
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
              currentRoles={project.roles}
              roleOptions={roleOptions}
              updateRolesDisabled={
                // TODO: Remove checking of ownership once update role is setup by default on project
                project.createdBy !== user?.uid &&
                !userHasPermission('update.roles')
              }
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
