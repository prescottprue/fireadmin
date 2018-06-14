import React from 'react'
import PropTypes from 'prop-types'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Dialog from '@material-ui/core/Dialog'
import { map, find } from 'lodash'
import PersonIcon from '@material-ui/icons/Person'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Slide from '@material-ui/core/Slide'
import UsersSearch from 'components/UsersSearch'
import classes from './SharingDialog.scss'

function Transition(props) {
  return <Slide direction="up" {...props} />
}

export const SharingDialog = ({
  open,
  onRequestClose,
  project,
  projectCollaborators,
  users,
  selectedCollaborators,
  selectCollaborator,
  saveCollaborators
}) => (
  <Dialog
    open={open}
    onRequestClose={onRequestClose}
    className={classes.container}
    transition={Transition}
    modal={false}>
    <DialogTitle>Sharing</DialogTitle>
    <DialogContent className={classes.content}>
      {projectCollaborators ? (
        <div>
          <h4>Current Collaborators</h4>
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
          <h4>New Collaborators</h4>
          <List>
            {selectedCollaborators.map((user, i) => (
              <ListItem key={`SelectedUser-${user.id || user.objectID}-${i}`}>
                <PersonIcon />
                <ListItemText primary={user.displayName} />
                <ListItemSecondaryAction>
                  <Checkbox
                    onChange={() => selectCollaborator(user)}
                    checked={
                      !!find(selectedCollaborators, {
                        objectID: user.id || user.objectID
                      })
                    }
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
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

SharingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  project: PropTypes.object,
  users: PropTypes.object,
  projectCollaborators: PropTypes.array,
  onRequestClose: PropTypes.func, // from enhancer (withStateHandlers)
  selectedCollaborators: PropTypes.array.isRequired, // from enhancer (withStateHandlers)
  selectCollaborator: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  saveCollaborators: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default SharingDialog
