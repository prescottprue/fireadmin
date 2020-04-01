import React from 'react'
import PropTypes from 'prop-types'
import { map, invoke, get } from 'lodash'
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
import { useFirestore } from 'reactfire'
import UsersSearch from 'components/UsersSearch'
import UsersList from 'components/UsersList'
import { triggerAnalyticsEvent } from 'utils/analytics'
import useNotifications from 'modules/notification/useNotifications'
import styles from './SharingDialog.styles'

const useStyles = makeStyles(styles)

function SharingDialog({
  open,
  onRequestClose,
  project,
  users,
  displayNames,
  selectedCollaborators,
  selectCollaborator
}) {
  const classes = useStyles()
  const { showSuccess, showError } = useNotifications()
  const firestore = useFirestore()
  const collaborators = get(project, 'collaborators')
  const projectCollaborators = map(collaborators, (collaborator, collabId) => {
    return {
      displayName: get(displayNames, collabId, 'User'),
      ...collaborator
    }
  })

  async function saveCollaborators(newInstance) {
    const currentProject = await firestore.get(`projects/${project.id}`)
    const projectData = invoke(currentProject, 'data')
    const collaborators = get(projectData, 'collaborators', {})
    const permissions = get(projectData, 'permissions', {})
    selectedCollaborators.forEach((currentCollaborator) => {
      if (!get(projectData, `collaborators.${currentCollaborator.objectID}`)) {
        collaborators[currentCollaborator.objectID] = true
        permissions[currentCollaborator.objectID] = {
          permission: 'viewer',
          role: 'viewer',
          sharedAt: firestore.FieldValue.serverTimestamp()
        }
      }
    })
    try {
      await firestore
        .doc(`projects/${project.id}`)
        .update({ collaborators, permissions })
      onRequestClose()
      showSuccess('Collaborator added successfully')
      triggerAnalyticsEvent('addCollaborator', { projectId: project.id })
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
  onRequestClose: PropTypes.func, // from enhancer (withStateHandlers)
  selectedCollaborators: PropTypes.array.isRequired, // from enhancer (withStateHandlers)
  selectCollaborator: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  saveCollaborators: PropTypes.func.isRequired, // from enhancer (withHandlers)
  open: PropTypes.bool.isRequired,
  project: PropTypes.object,
  users: PropTypes.object,
  projectCollaborators: PropTypes.array
}

export default SharingDialog
