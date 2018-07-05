import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import PermissionsTable from '../PermissionsTable'
import RolesTable from '../RolesTable'
import NewMemberModal from '../NewMemberModal'
import classes from './Permissions.scss'

export const Permissions = ({
  projectId,
  toggleNewMemberModal,
  addMemberDisabled,
  newMemberModalOpen
}) => (
  <div className={classes.container}>
    <Typography className={classes.pageHeader}>Permissions</Typography>
    <div className={classes.buttons}>
      <Button
        disabled={addMemberDisabled}
        color="primary"
        variant="raised"
        aria-label="Add Member"
        onClick={toggleNewMemberModal}>
        Add Member
      </Button>
    </div>
    <PermissionsTable projectId={projectId} />
    <RolesTable projectId={projectId} />
    <NewMemberModal
      projectId={projectId}
      open={newMemberModalOpen}
      onRequestClose={toggleNewMemberModal}
    />
  </div>
)

Permissions.propTypes = {
  projectId: PropTypes.string.isRequired,
  addMemberDisabled: PropTypes.bool.isRequired,
  toggleNewMemberModal: PropTypes.func.isRequired,
  newMemberModalOpen: PropTypes.bool.isRequired
}

export default Permissions
