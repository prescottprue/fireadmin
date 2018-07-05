import React from 'react'
import PropTypes from 'prop-types'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import UsersSearch from 'components/UsersSearch'
import UsersList from 'components/UsersList'
import classes from './NewMemberModal.scss'

export const NewMemberModal = ({
  callSubmit,
  projectId,
  onRequestClose,
  closeAndReset,
  selectCollaborator,
  collaborators,
  selectedCollaborators,
  open
}) => (
  <Dialog onClose={onRequestClose} open={open}>
    <DialogTitle id="dialog-title">Add Member</DialogTitle>
    <DialogContent className={classes.body}>
      <div className={classes.search}>
        <UsersSearch
          onSuggestionClick={selectCollaborator}
          ignoreSuggestions={collaborators}
          resultsTitle="New Collaborators"
        />
      </div>
      {selectedCollaborators.length ? (
        <div>
          <h4>New Collaborators</h4>
          <UsersList
            users={selectedCollaborators}
            onUserClick={selectCollaborator}
          />
        </div>
      ) : null}
    </DialogContent>
    <DialogActions>
      <Button color="secondary" onClick={closeAndReset}>
        Cancel
      </Button>
      <Button
        color="primary"
        disabled={!selectedCollaborators}
        onClick={callSubmit}>
        Add Member
      </Button>
    </DialogActions>
  </Dialog>
)

NewMemberModal.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  selectCollaborator: PropTypes.func.isRequired,
  collaborators: PropTypes.array.isRequired,
  selectedCollaborators: PropTypes.array.isRequired,
  callSubmit: PropTypes.func.isRequired,
  projectId: PropTypes.string,
  open: PropTypes.bool.isRequired, // captured in other
  closeAndReset: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default NewMemberModal
