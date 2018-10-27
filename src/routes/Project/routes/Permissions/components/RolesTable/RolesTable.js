import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import RolesTableRow from '../RolesTableRow'
import NewRoleCard from '../NewRoleCard'
import NoRolesFound from './NoRolesFound'
import { formNames } from 'constants'
import classesFromStyles from './RolesTable.scss'
import DownArrow from '@material-ui/icons/ArrowDownward'

export const RolesTable = ({
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
}) => (
  <div className={classesFromStyles.root}>
    <Typography className={classes.heading}>Roles</Typography>
    <div className={classesFromStyles.buttons}>
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
    <div className={classesFromStyles.rolesTable}>
      {orderedRoles && orderedRoles.length ? (
        orderedRoles.map(({ name, permissions, key }) => (
          <RolesTableRow
            key={key}
            form={`${formNames.projectRoles}.${key}`}
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

RolesTable.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  updateRole: PropTypes.func.isRequired,
  openNewRole: PropTypes.func.isRequired,
  deleteRole: PropTypes.func.isRequired,
  closeNewRole: PropTypes.func.isRequired,
  addRole: PropTypes.func.isRequired,
  newRoleOpen: PropTypes.bool.isRequired,
  addRoleDisabled: PropTypes.bool.isRequired,
  projectId: PropTypes.string.isRequired,
  orderedRoles: PropTypes.array
}

export default RolesTable
