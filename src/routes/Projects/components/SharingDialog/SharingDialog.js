/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui-next/Dialog'
import Button from 'material-ui-next/Button'
import { MenuItem } from 'material-ui-next/Menu'
import Slide from 'material-ui-next/transitions/Slide'
import {
  InstantSearch,
  Hits,
  Stats,
  SearchBox,
  Panel,
  Highlight
} from 'react-instantsearch/dom'
import { connectStateResults } from 'react-instantsearch/connectors'
// import 'react-instantsearch-theme-algolia/style.scss' // didn't work, so css was used from cdn in index.html
import classes from './SharingDialog.scss'

const Content = connectStateResults(
  ({ searchState, searchResults }) =>
    searchState.query && searchResults && searchResults.nbHits !== 0 ? (
      <div>
        <Stats />
        <Hits hitComponent={SearchedUser} />
      </div>
    ) : null
)

function SearchedUser({ hit }) {
  return (
    <MenuItem style={{ marginTop: '10px' }}>
      <span className="hit-name">
        <Highlight attributeName="displayName" hit={hit} />
      </span>
    </MenuItem>
  )
}

function Transition(props) {
  return <Slide direction="up" {...props} />
}

export const SharingDialog = ({
  open,
  onRequestClose,
  handleSubmit,
  suggestions,
  searchUsers,
  clearSuggestions,
  selectedCollaborators,
  selectCollaborator,
  handleChange
}) => (
  <Dialog
    open={open}
    onRequestClose={onRequestClose}
    className={classes.container}
    transition={Transition}
    keepMounted>
    <DialogTitle>Sharing</DialogTitle>
    <DialogContent>
      {selectedCollaborators.length ? (
        <div>
          {selectedCollaborators.map(user => <div>{JSON.stringify(user)}</div>)}
          <Button color="primary">Add Collaborators</Button>
        </div>
      ) : null}
      <div className={classes.search}>
        <InstantSearch
          appId="C0D1I0GB86"
          apiKey="7327fc566154893e3834a49de6fa73c3"
          indexName="users">
          <SearchBox autoFocus />
          <Panel title="Users">
            <Content selectCollaborator={selectCollaborator} />
          </Panel>
        </InstantSearch>
      </div>
    </DialogContent>
    <DialogActions>
      <Button color="accept" onTouchTap={onRequestClose}>
        Save
      </Button>
    </DialogActions>
  </Dialog>
)

SharingDialog.propTypes = {
  open: PropTypes.bool,
  selectCollaborator: PropTypes.func, // from enhancer
  selectedCollaborators: PropTypes.func, // from enhancer
  suggestions: PropTypes.array, // from enhancer
  searchUsers: PropTypes.func.isRequired, // from enhancer (withHandlers)
  clearSuggestions: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  onRequestClose: PropTypes.func, // from enhancer (withStateHandlers)
  handleChange: PropTypes.func, // from enhancer (reduxForm)
  handleSubmit: PropTypes.func // from enhancer (reduxForm)
}

export default SharingDialog
