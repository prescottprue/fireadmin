import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import PermissionsTable from '../PermissionsTable'
import NewMemberModal from '../NewMemberModal'
import classes from './Permissions.scss'

export const Permissions = ({
  projectId,
  handleSubmit,
  submitting,
  toggleNewMemberModal,
  newMemberModalOpen
}) => (
  <div className={classes.container}>
    <Typography className={classes.pageHeader}>Permissions</Typography>
    <form className={classes.container} onSubmit={handleSubmit}>
      <div className={classes.buttons}>
        <Button
          disabled={submitting}
          color="primary"
          variant="raised"
          aria-label="Add Member"
          onClick={toggleNewMemberModal}>
          Add Member
        </Button>
      </div>
      <PermissionsTable projectId={projectId} />
      <NewMemberModal
        projectId={projectId}
        open={newMemberModalOpen}
        onRequestClose={toggleNewMemberModal}
        onNewMemberClick={() => {}}
      />
    </form>
  </div>
)

Permissions.propTypes = {
  projectId: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  toggleNewMemberModal: PropTypes.func.isRequired,
  newMemberModalOpen: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default Permissions
