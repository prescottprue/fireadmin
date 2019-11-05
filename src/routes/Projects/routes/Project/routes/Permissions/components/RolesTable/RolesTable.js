import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import DownArrow from '@material-ui/icons/ArrowDownward'
import { PROJECT_ROLES_FORM_NAME } from 'constants/formNames'
import RolesTableRow from '../RolesTableRow'
import NewRoleCard from '../NewRoleCard'
import NoRolesFound from './NoRolesFound'

function RolesTable({
  orderedRoles,
  classes,
  addRole,
  updateRole,
  deleteRole,
  openNewRole,
  newRoleOpen,
  closeNewRole,
  addRoleDisabled,
  projectId
}) {
  return (
    <div className={classes.root}>
      <Typography className={classes.heading}>Roles</Typography>
      <div className={classes.buttons}>
        <Button
          color="primary"
          variant="contained"
          aria-label="Add Role"
          onClick={openNewRole}
          disabled={addRoleDisabled}>
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
              form={`${PROJECT_ROLES_FORM_NAME}-${key}`}
              roleKey={key}
              name={name}
              onSubmit={updateRole}
              projectId={projectId}
              initialValues={permissions}
              onDeleteClick={deleteRole}
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
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  addRole: PropTypes.func.isRequired, // from enhancer (withHandlers)
  updateRole: PropTypes.func.isRequired, // from enhancer (withHandlers)
  deleteRole: PropTypes.func.isRequired, // from enhancer (withHandlers)
  openNewRole: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  closeNewRole: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  newRoleOpen: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  addRoleDisabled: PropTypes.bool.isRequired, // from enhancer (withProps)
  projectId: PropTypes.string.isRequired,
  orderedRoles: PropTypes.array
}

export default RolesTable
