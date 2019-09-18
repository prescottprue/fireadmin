import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import PermissionsTable from '../PermissionsTable'
import RolesTable from '../RolesTable'
import NewMemberModal from '../NewMemberModal'

function Permissions({
  classes,
  projectId,
  toggleNewMemberModal,
  addMemberDisabled,
  newMemberModalOpen
}) {
  return (
    <div className={classes.root}>
      <Typography variant="h4">Permissions</Typography>
      <div className={classes.buttons}>
        <Button
          disabled={addMemberDisabled}
          color="primary"
          variant="contained"
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
}

Permissions.propTypes = {
  projectId: PropTypes.string.isRequired,
  addMemberDisabled: PropTypes.bool.isRequired,
  toggleNewMemberModal: PropTypes.func.isRequired,
  newMemberModalOpen: PropTypes.bool.isRequired
}

export default Permissions
