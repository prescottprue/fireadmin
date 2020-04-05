import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import PermissionsTable from '../PermissionsTable'
import RolesTable from '../RolesTable'
import NewMemberModal from '../NewMemberModal'
import styles from './Permissions.styles'

const useStyles = makeStyles(styles)

function Permissions({ projectId, addMemberDisabled }) {
  const classes = useStyles()
  const [newMemberModalOpen, changeNewMemberModalOpen] = useState(false)
  const toggleNewMemberModal = () => changeNewMemberModalOpen(false)
  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.pageHeader}>
        Permissions
      </Typography>
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
  addMemberDisabled: PropTypes.bool.isRequired
}

export default Permissions
