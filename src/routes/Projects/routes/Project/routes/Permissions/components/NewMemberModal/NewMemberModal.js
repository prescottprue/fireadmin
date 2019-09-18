import React from 'react'
import PropTypes from 'prop-types'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import UsersSearch from 'components/UsersSearch'
import UsersList from 'components/UsersList'

function NewMemberModal({
  classes,
  callSubmit,
  projectId,
  onRequestClose,
  closeAndReset,
  selectCollaborator,
  collaborators,
  selectedCollaborators,
  open
}) {
  return (
    <Dialog onClose={onRequestClose} open={open}>
      <DialogTitle id="dialog-title">Add Member</DialogTitle>
      <DialogContent>
        <div>
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
}

NewMemberModal.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  closeAndReset: PropTypes.func.isRequired, // from enhancer (withHandlers)
  selectCollaborator: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  collaborators: PropTypes.array.isRequired, // from enhancer (connect)
  selectedCollaborators: PropTypes.array.isRequired, // from enhancer (withStateHandlers)
  callSubmit: PropTypes.func.isRequired, // from enhancer (withHandlers)
  onRequestClose: PropTypes.func.isRequired,
  projectId: PropTypes.string,
  open: PropTypes.bool.isRequired // captured in other
}

export default NewMemberModal
