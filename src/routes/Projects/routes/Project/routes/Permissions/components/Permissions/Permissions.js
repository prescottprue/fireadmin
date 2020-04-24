import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'
import PermissionsTable from '../PermissionsTable'
import RolesTable from '../RolesTable'
import NewMemberModal from '../NewMemberModal'
import styles from './Permissions.styles'
import { createPermissionGetter } from 'utils/data'

const useStyles = makeStyles(styles)

function Permissions({ projectId }) {
  const classes = useStyles()
  // State
  const [newMemberModalOpen, changeNewMemberModalOpen] = useState(false)
  function toggleNewMemberModal() {
    return changeNewMemberModalOpen(!newMemberModalOpen)
  }

  // Data
  const firestore = useFirestore()
  const user = useUser()
  const projectRef = firestore.doc(`${PROJECTS_COLLECTION}/${projectId}`)
  const project = useFirestoreDocData(projectRef)
  const userHasPermission = createPermissionGetter(project, user?.uid)
  const hasUpdatePermission = userHasPermission('update.permissions')

  return (
    <div className={classes.root}>
      <Typography variant="h4" className={classes.pageHeader}>
        Permissions
      </Typography>
      <div className={classes.buttons}>
        <Button
          disabled={!hasUpdatePermission}
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
