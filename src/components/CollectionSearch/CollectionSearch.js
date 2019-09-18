import React from 'react'
import PropTypes from 'prop-types'
import {
  InstantSearch,
  PoweredBy,
  SearchBox,
  Configure
} from 'react-instantsearch/dom'
import SearchResults from './SearchResults'
import { algolia } from '../../config'
// import 'react-instantsearch-theme-algolia/style.scss' // didn't work, so css was used from cdn in index.html

function CollectionSearch({
  classes,
  onSuggestionClick,
  filterString,
  indexName
}) {
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
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  filterString: PropTypes.string.isRequired, // from enhancer (withProps)
  indexName: PropTypes.string.isRequired,
  onSuggestionClick: PropTypes.func
}

export default CollectionSearch
