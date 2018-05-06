import React from 'react'
import PropTypes from 'prop-types'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import { map, find } from 'lodash'
import PersonIcon from 'material-ui-icons/Person'
import Button from 'material-ui/Button'
import Checkbox from 'material-ui/Checkbox'
import List, {
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from 'material-ui/List'
import Slide from 'material-ui/transitions/Slide'
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
      <Button color="secondary" onTouchTap={onRequestClose}>
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
  projectCollaborators: PropTypes.array,
  onRequestClose: PropTypes.func, // from enhancer (withStateHandlers)
  selectedCollaborators: PropTypes.array.isRequired, // from enhancer (withStateHandlers)
  selectCollaborator: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  saveCollaborators: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default SharingDialog
