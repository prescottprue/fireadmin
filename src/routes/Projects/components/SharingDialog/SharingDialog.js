import React from 'react'
import PropTypes from 'prop-types'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui-next/Dialog'
import { get, map } from 'lodash'
import PersonIcon from 'material-ui/svg-icons/social/person'
import { MenuItem } from 'material-ui-next/Menu'
import Button from 'material-ui-next/Button'
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
    keepMounted>
    <DialogTitle>Sharing</DialogTitle>
    <DialogContent>
      <h4>Current Collaborators</h4>
      {project.collaborators
        ? map(project.collaborators, (user, i) => {
            return (
              <MenuItem key={`Collabe-${user.id}-${i}`}>
                <PersonIcon />
                {get(users, `${user.id}.displayName`, 'User')}
              </MenuItem>
            )
          })
        : null}
      <h4>New Collaborators</h4>
      {selectedCollaborators.length ? (
        <div>
          {selectedCollaborators.map((user, i) => (
            <MenuItem key={`SelectedUser-${user.id || user.objectID}-${i}`}>
              <PersonIcon />
              <span>{user.displayName}</span>
            </MenuItem>
          ))}
          <Button color="primary" onClick={saveCollaborators}>
            Add New Collaborators
          </Button>
        </div>
      ) : null}
      <div className={classes.search}>
        <UsersSearch
          onSuggestionClick={selectCollaborator}
          ignoreSuggestions={map(project.collaborators, (val, key) => key)}
        />
      </div>
    </DialogContent>
    <DialogActions>
      <Button color="primary" onTouchTap={onRequestClose}>
        Done
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
