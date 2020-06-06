import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { map, findIndex } from 'lodash'
import { useFirestore, useDatabase, useDatabaseObjectData } from 'reactfire'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import Typography from '@material-ui/core/Typography'
import PersonIcon from '@material-ui/icons/Person'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import UsersSearch from 'components/UsersSearch'
import UsersList from 'components/UsersList'
import {
  PROJECTS_COLLECTION,
  DISPLAY_NAMES_PATH
} from 'constants/firebasePaths'
import { triggerAnalyticsEvent } from 'utils/analytics'
import useNotifications from 'modules/notification/useNotifications'
import styles from './SharingDialog.styles'

const useStyles = makeStyles(styles)

function SharingDialog({ open, onRequestClose, project }) {
  const classes = useStyles()
  const { showSuccess, showError } = useNotifications()
  const [selectedCollaborators, changeSelectedCollaborators] = useState([])

  const database = useDatabase()
  const displayNamesRef = database.ref(DISPLAY_NAMES_PATH)
  const displayNames = useDatabaseObjectData(displayNamesRef)

  const firestore = useFirestore()
  const { FieldValue } = useFirestore
  const { collaborators = {}, permissions = {} } = project
  const projectCollaborators = map(collaborators, (collaborator, collabId) => {
    return {
      displayName: (displayNames && displayNames[collabId]) || 'User',
      ...collaborator
    }
  })

  function selectCollaborator(newCollaborator) {
    const currentIndex = findIndex(selectedCollaborators, {
      objectID: newCollaborator.id || newCollaborator.objectID
    })
    const newSelected = [...selectedCollaborators]

    if (currentIndex === -1) {
      newSelected.push(newCollaborator)
    } else {
      newSelected.splice(currentIndex, 1)
    }

    changeSelectedCollaborators(newSelected)
  }

  async function saveCollaborators(newInstance) {
    selectedCollaborators.forEach((currentCollaborator) => {
      if (!project[currentCollaborator.objectID]) {
        collaborators[currentCollaborator.objectID] = true
        permissions[currentCollaborator.objectID] = {
          permission: 'viewer',
          role: 'viewer',
          sharedAt: FieldValue.serverTimestamp()
        }
      }
    })
    try {
      await firestore
        .doc(`${PROJECTS_COLLECTION}/${project.id}`)
        .set({ collaborators, permissions }, { merge: true })
      changeSelectedCollaborators([])
      onRequestClose()
      showSuccess('Collaborator added successfully')
      triggerAnalyticsEvent('addCollaborator', {
        projectId: project.id
      })
    } catch (err) {
      showError('Collaborator could not be added')
      throw err
    }
  }

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle>Sharing</DialogTitle>
      <DialogContent className={classes.content}>
        {projectCollaborators ? (
          <div className={classes.current}>
            <Typography variant="h6">Current Collaborators</Typography>
            <List>
              {map(projectCollaborators, (collab, i) => {
                return (
                  <ListItem key={`Collab-${i}`}>
                    <PersonIcon />
                    <ListItemText
                      primary={collab.displayName}
                      secondary={collab.email}
                    />
                  </ListItem>
                )
              })}
            </List>
          </div>
        ) : null}
        {selectedCollaborators.length ? (
          <div className={classes.current}>
            <Typography variant="h6">New Collaborators</Typography>
            <UsersList
              users={selectedCollaborators}
              onUserClick={selectCollaborator}
            />
          </div>
        ) : null}
        <div className={classes.search}>
          <UsersSearch
            onSuggestionClick={selectCollaborator}
            ignoreSuggestions={map(project.collaborators, (val, key) => key)}
            resultsTitle="User Results (click to add)"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onRequestClose}>
          Cancel
        </Button>
        <Button color="primary" onClick={saveCollaborators}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

SharingDialog.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  project: PropTypes.object.isRequired
}

export default SharingDialog
