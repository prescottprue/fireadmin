import React from 'react'
import PropTypes from 'prop-types'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import UsersSearch from 'components/UsersSearch'
import UsersList from 'components/UsersList'
import useNewMemberModal from './useNewMemberModal'

function NewMemberModal({ projectId, onRequestClose, open }) {
  const {
    selectCollaborator,
    selectedCollaborators,
    project,
    closeAndReset,
    updateCollaborators
  } = useNewMemberModal({ projectId, onRequestClose, open })
  return (
    <Dialog onClose={onRequestClose} open={open}>
      <DialogTitle id="dialog-title">Add Member</DialogTitle>
      <DialogContent>
        <div>
          <UsersSearch
            onSuggestionClick={selectCollaborator}
            ignoreSuggestions={
              project &&
              project.collaborators &&
              Object.keys(project.collaborators)
            }
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
          onClick={updateCollaborators}>
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  )
}

NewMemberModal.propTypes = {
  onRequestClose: PropTypes.func.isRequired,
  projectId: PropTypes.string,
  open: PropTypes.bool.isRequired
}

export default NewMemberModal
