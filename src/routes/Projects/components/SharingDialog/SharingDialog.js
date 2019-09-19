import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
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
import styles from './SharingDialog.styles'

const useStyles = makeStyles(styles)

function SharingDialog({
  open,
  onRequestClose,
  project,
  projectCollaborators,
  users,
  selectedCollaborators,
  selectCollaborator,
  saveCollaborators
}) {
  const classes = useStyles()
  return (
    <Dialog open={open} onClose={onRequestClose} className={classes.container}>
      <DialogTitle>Sharing</DialogTitle>
      <DialogContent className={classes.content}>
        {projectCollaborators ? (
          <div>
            <Typography variant="h6">Current Collaborators</Typography>
            <List>
              {map(projectCollaborators, (displayName, i) => {
                return (
                  <ListItem key={`Collab-${i}`}>
                    <PersonIcon />
                    <ListItemText primary={displayName} />
                  </ListItem>
                )
              })}
            </List>
          </div>
        ) : null}
        <div className={classes.search}>
          <UsersSearch
            onSuggestionClick={selectCollaborator}
            ignoreSuggestions={map(project.collaborators, (val, key) => key)}
            resultsTitle="New Collaborators"
          />
        </div>
        {selectedCollaborators.length ? (
          <div>
            <Typography>New Collaborators</Typography>
            <UsersList
              users={selectedCollaborators}
              onUserClick={selectCollaborator}
            />
          </div>
        ) : null}
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
