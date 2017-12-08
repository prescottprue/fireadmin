import React from 'react'
import PropTypes from 'prop-types'
import {
  InstantSearch,
  PoweredBy,
  SearchBox,
  Panel,
  Configure
} from 'react-instantsearch/dom'
import SearchResults from './SearchResults'
import classes from './UsersSearch.scss'
import { algolia } from 'config'
// import 'react-instantsearch-theme-algolia/style.scss' // didn't work, so css was used from cdn in index.html

export const UsersSearch = ({ onSuggestionClick, filterString }) => (
  <InstantSearch
    appId={algolia.appId}
    apiKey={algolia.apiKey}
    indexName="users">
    <SearchBox autoFocus />
    <div className={classes.poweredBy}>
      <PoweredBy />
    </div>
    <div className={classes.spacer} />
    <Panel title="Users">
      <SearchResults onSuggestionClick={onSuggestionClick} />
    </Panel>
    <Configure filters={filterString} />
  </InstantSearch>
)

UsersSearch.propTypes = {
  onSuggestionClick: PropTypes.func,
  filterString: PropTypes.string
}

export default UsersSearch
