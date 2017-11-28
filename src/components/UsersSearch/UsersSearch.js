import React from 'react'
import PropTypes from 'prop-types'
import { InstantSearch, SearchBox, Panel } from 'react-instantsearch/dom'
import SearchResults from './SearchResults'
import classes from './UsersSearch.scss'
import { algolia } from 'config'
// import 'react-instantsearch-theme-algolia/style.scss' // didn't work, so css was used from cdn in index.html

export const UsersSearch = ({ onSuggestionClick }) => (
  <InstantSearch
    appId={algolia.appId}
    apiKey={algolia.apiKey}
    indexName="users">
    <SearchBox autoFocus />
    <div className={classes.spacer} />
    <Panel title="Users">
      <SearchResults onSuggestionClick={onSuggestionClick} />
    </Panel>
  </InstantSearch>
)

UsersSearch.propTypes = {
  onSuggestionClick: PropTypes.func
}

export default UsersSearch
