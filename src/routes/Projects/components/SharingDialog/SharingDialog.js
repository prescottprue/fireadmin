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
  Stats,
  SearchBox,
  Panel,
  Highlight
} from 'react-instantsearch/dom'
import {
  connectHits,
  connectStateResults
} from 'react-instantsearch/connectors'
// import 'react-instantsearch-theme-algolia/style.scss' // didn't work, so css was used from cdn in index.html
import classes from './SharingDialog.scss'

const SearchedUser = ({ hit, selectCollaborator }) => (
  <MenuItem style={{ marginTop: '10px' }} onClick={selectCollaborator}>
    <span className="hit-name">
      <Highlight attributeName="displayName" hit={hit} />
    </span>
  </MenuItem>
)

const CustomHits = connectHits(({ hits, selectCollaborator }) => (
  <div>
    {hits.map((hit, i) => (
      <SearchedUser
        key={`Hit-${hit.objectID}-${i}`}
        hit={hit}
        selectCollaborator={() => selectCollaborator(hit)}
      />
    ))}
  </div>
))

const Content = connectStateResults(
  ({ searchState, searchResults }) =>
    searchState.query && searchResults && searchResults.nbHits !== 0 ? (
      <div>
        <Stats />
        <CustomHits />
      </div>
    ) : null
)

function Transition(props) {
  return <Slide direction="up" {...props} />
}

export const SharingDialog = ({
  open,
  onRequestClose,
  handleSubmit,
  suggestions,
  clearSuggestions,
  selectedCollaborators,
  selectCollaborator,
  saveCollaborators,
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
          {selectedCollaborators.map((user, i) => (
            <div key={`SelectedUser-${user.objectID}-i`}>
              <span>{user.displayName}</span>
            </div>
          ))}
          <Button color="primary" onClick={saveCollaborators}>
            Add Collaborators
          </Button>
        </div>
      ) : null}
      <div className={classes.search}>
        <InstantSearch
          appId="C0D1I0GB86"
          apiKey="7327fc566154893e3834a49de6fa73c3"
          indexName="users">
          <SearchBox autoFocus />
          <div style={{ height: '2rem' }} />
          <Panel title="Users">
            <Content selectCollaborator={selectCollaborator} />
          </Panel>
        </InstantSearch>
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
  open: PropTypes.bool,
  selectCollaborator: PropTypes.func, // from enhancer
  selectedCollaborators: PropTypes.array, // from enhancer
  suggestions: PropTypes.array, // from enhancer
  clearSuggestions: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  onRequestClose: PropTypes.func, // from enhancer (withStateHandlers)
  handleChange: PropTypes.func, // from enhancer (reduxForm)
  handleSubmit: PropTypes.func // from enhancer (reduxForm)
}

export default SharingDialog
