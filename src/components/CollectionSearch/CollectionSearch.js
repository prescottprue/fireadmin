import React from 'react'
import PropTypes from 'prop-types'
import {
  InstantSearch,
  PoweredBy,
  SearchBox,
  Configure
} from 'react-instantsearch/dom'
import { makeStyles } from '@material-ui/core/styles'
import styles from './CollectionSearch.styles'
import SearchResults from './SearchResults'
import { algolia } from '../../config'
// import 'react-instantsearch-theme-algolia/style.scss' // didn't work, so css was used from cdn in index.html

const useStyles = makeStyles(styles)

function CollectionSearch({
  onSuggestionClick,
  ignoreSuggestions,
  uid,
  indexName
}) {
  const classes = useStyles()

  // Map ignore suggestions list to get ids
  const ignoreIds = !ignoreSuggestions
    ? [uid] // ignore just logged in user if no ignoreSuggestions provided
    : [uid].concat(
        // ignore logged in user and ignoreSuggestions
        ignoreSuggestions.map(
          (suggestion) => suggestion.id || suggestion.objectID
        )
      )

  const filterString = ignoreIds
    .map(
      (id, index) =>
        `${
          index !== 0 && index !== ignoreIds.length ? 'AND ' : ''
        }NOT objectID:${id}`
    )
    .join(' ')
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
  indexName: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  ignoreSuggestions: PropTypes.array,
  onSuggestionClick: PropTypes.func
}

export default CollectionSearch
