import React from 'react'
import PropTypes from 'prop-types'
import {
  InstantSearch,
  PoweredBy,
  SearchBox,
  Configure
} from 'react-instantsearch/dom'
import SearchResults from './SearchResults'
import classes from './CollectionSearch.scss'
import { algolia } from '../../config'
// import 'react-instantsearch-theme-algolia/style.scss' // didn't work, so css was used from cdn in index.html

function CollectionSearch({ onSuggestionClick, filterString, indexName }) {
  return (
    <InstantSearch
      appId={algolia.appId}
      apiKey={algolia.apiKey}
      indexName={indexName}>
      <SearchBox autoFocus />
      <div className={classes.poweredBy}>
        <PoweredBy />
      </div>
      <div className={classes.spacer} />
      <SearchResults onSuggestionClick={onSuggestionClick} />
      <Configure filters={filterString} />
    </InstantSearch>
  )
}

CollectionSearch.propTypes = {
  onSuggestionClick: PropTypes.func,
  filterString: PropTypes.string,
  indexName: PropTypes.string.isRequired
}

export default CollectionSearch
