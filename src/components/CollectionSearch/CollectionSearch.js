import React from 'react'
import PropTypes from 'prop-types'
import {
  InstantSearch,
  PoweredBy,
  SearchBox,
  Panel,
  Configure
} from 'react-instantsearch/dom'
import { capitalize, startCase } from 'lodash'
import SearchResults from './SearchResults'
import classes from './CollectionSearch.scss'
import { algolia } from '../../config'
// import 'react-instantsearch-theme-algolia/style.scss' // didn't work, so css was used from cdn in index.html

export const CollectionSearch = ({
  onSuggestionClick,
  filterString,
  indexName
}) => (
  <InstantSearch
    appId={algolia.appId}
    apiKey={algolia.apiKey}
    indexName={indexName}>
    <SearchBox autoFocus />
    <div className={classes.poweredBy}>
      <PoweredBy />
    </div>
    <div className={classes.spacer} />
    <Panel title={capitalize(startCase(indexName))}>
      <SearchResults onSuggestionClick={onSuggestionClick} />
    </Panel>
    <Configure filters={filterString} />
  </InstantSearch>
)

CollectionSearch.propTypes = {
  onSuggestionClick: PropTypes.func,
  filterString: PropTypes.string,
  indexName: PropTypes.string.isRequired
}

export default CollectionSearch
