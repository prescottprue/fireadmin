import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import RolesTableRow from '../RolesTableRow'
import NewRoleCard from '../NewRoleCard'
import { formNames } from 'constants'
import classes from './RolesTable.scss'

export const RolesTable = ({
  roles,
  addRole,
  updateRole,
  deleteRole,
  openNewRole,
  newRoleOpen,
  closeNewRole,
  addRoleDisabled,
  projectId
}) => (
  <div className={classes.root}>
    <div className={classes.buttons}>
      <Button
        color="primary"
        variant="raised"
        aria-label="Add Role"
        onClick={openNewRole}
        disabled={addRoleDisabled}>
        Add Role
      </Button>
    </div>
    <Collapse in={newRoleOpen}>
      <NewRoleCard onRequestClose={closeNewRole} onSubmit={addRole} />
    </Collapse>
    <div style={{ height: '100%' }}>
      {map(roles, ({ name, permissions }, roleKey) => (
        <RolesTableRow
          key={roleKey}
          form={`${formNames.projectRoles}.${roleKey}`}
          roleKey={roleKey}
          name={name}
          permissions={permissions}
          onSubmit={updateRole}
          projectId={projectId}
          initialValues={roles[roleKey]}
          onDeleteClick={deleteRole}
        />
      ))}
    </div>
  </div>
)

RolesTable.propTypes = {
  updateRole: PropTypes.func.isRequired,
  openNewRole: PropTypes.func.isRequired,
  deleteRole: PropTypes.func.isRequired,
  closeNewRole: PropTypes.func.isRequired,
  addRole: PropTypes.func.isRequired,
  newRoleOpen: PropTypes.bool.isRequired,
  addRoleDisabled: PropTypes.bool.isRequired,
  projectId: PropTypes.string.isRequired,
  roles: PropTypes.object
}

export default RolesTable
