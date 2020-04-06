import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import PermissionsTable from '../PermissionsTable'
import RolesTable from '../RolesTable'
import NewMemberModal from '../NewMemberModal'
import styles from './Permissions.styles'

const useStyles = makeStyles(styles)

function Permissions({ projectId }) {
  const classes = useStyles()
  const [newMemberModalOpen, changeNewMemberModalOpen] = useState(false)
  const toggleNewMemberModal = () =>
    changeNewMemberModalOpen(!newMemberModalOpen)
  const firestore = useFirestore()
  const user = useUser()
  const projectRef = firestore.doc(`projects/${projectId}`)
  const project = useFirestoreDocData(projectRef)
  const currentUserOwnsProject = project && project.createdBy === user.uid
  const currentUserRole = get(project, `permissions.${user.uid}.role`)
  const permissionsByType = get(project, `roles.${currentUserRole}.permissions`)
  const hasUpdatePermission =
    get(permissionsByType, 'update.permissions') === true
  const addMemberDisabled = !currentUserOwnsProject && !hasUpdatePermission

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
  projectId: PropTypes.string.isRequired
}

export default Permissions
