import React from 'react'
import PropTypes from 'prop-types'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui-next/Dialog'
import { get, map, find } from 'lodash'
import PersonIcon from 'material-ui-icons/Person'
import Button from 'material-ui-next/Button'
import Checkbox from 'material-ui-next/Checkbox'
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from 'material-ui-next/List'
import Slide from 'material-ui-next/transitions/Slide'
import UsersSearch from 'components/UsersSearch'
import classes from './SharingDialog.scss'

function Transition(props) {
  return <Slide direction="up" {...props} />
}

export const SharingDialog = ({
  open,
  onRequestClose,
  project,
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
      {project.collaborators ? (
        <div>
          <h4>Current Collaborators</h4>
          <List>
            {map(project.collaborators, (user, i) => {
              return (
                <ListItem key={`Collab-${user.id}-${i}`}>
                  <PersonIcon />
                  <ListItemText
                    primary={get(users, `${user.id}.displayName`, 'User')}
                  />
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
        />
      </div>
      <h4>New Collaborators</h4>
      {selectedCollaborators.length ? (
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
      ) : null}
    </DialogContent>
    <DialogActions>
      <Button color="accent" onTouchTap={onRequestClose}>
        Cancel
      </Button>
      <Button color="primary" onTouchTap={saveCollaborators}>
        Save
      </Button>
    </DialogActions>
  </Dialog>
)

SharingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  project: PropTypes.object,
  users: PropTypes.object,
  onRequestClose: PropTypes.func, // from enhancer (withStateHandlers)
  selectedCollaborators: PropTypes.array.isRequired, // from enhancer (withStateHandlers)
  selectCollaborator: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  saveCollaborators: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default SharingDialog
