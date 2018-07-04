import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Paper from '@material-ui/core/Paper'
import PermissionsTableRow from '../PermissionsTableRow'
import DeleteMemberModal from '../DeleteMemberModal'
import classesFromStyles from './PermissionsTable.scss'
import { formNames } from 'constants'

export const PermissionsTable = ({
  collaborators,
  updatePermissions,
  projectId,
  startDelete,
  handleDeleteClose,
  selectedMemberName,
  deleteDialogOpen,
  classes,
  removeMember
}) => (
  <div className={classesFromStyles.table}>
    <Paper square className={classes.headingPaper}>
      <span className={classes.headerLeft}>Member</span>
      <span>Role</span>
    </Paper>
    <DeleteMemberModal
      open={deleteDialogOpen}
      name={selectedMemberName}
      onRequestClose={handleDeleteClose}
      onDeleteClick={removeMember}
    />
    {map(collaborators, ({ role, uid, displayName }, index) => (
      <PermissionsTableRow
        key={`${uid}-${role}`}
        uid={uid}
        role={role}
        displayName={displayName}
        onSubmit={updatePermissions}
        projectId={projectId}
        form={`${formNames.projectPermissions}.${uid}`}
        initialValues={{ [uid]: { role } }}
        onDeleteClick={startDelete}
      />
    ))}
  </div>
)

PermissionsTable.propTypes = {
  collaborators: PropTypes.array.isRequired,
  projectId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  selectedMemberName: PropTypes.string, // from enhancer (withStateHandlers)
  deleteDialogOpen: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  handleDeleteClose: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  startDelete: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  updatePermissions: PropTypes.func.isRequired, // from enhancer (withHandlers)
  removeMember: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default PermissionsTable
