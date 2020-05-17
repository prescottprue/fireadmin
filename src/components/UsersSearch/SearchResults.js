import React from 'react'
import PropTypes from 'prop-types'
import { Stats } from 'react-instantsearch/dom'
import { connectStateResults } from 'react-instantsearch/connectors'
import ResultsList from './ResultsList'

function SearchResults({
  searchState,
  searchResults,
  onSuggestionClick,
  resultsTitle
}) {
  return searchState.query && searchResults && searchResults.nbHits !== 0 ? (
    <div>
      {resultsTitle ? <div>{resultsTitle}</div> : null}
      <Stats />
      <ResultsList onSuggestionClick={onSuggestionClick} />
    </div>
  ) : null
}

SearchResults.propTypes = {
  searchState: PropTypes.shape({
    // from connectStateResults
    query: PropTypes.string
  }),
  resultsTitle: PropTypes.string,
  onSuggestionClick: PropTypes.func.isRequired,
  searchResults: PropTypes.object // from connectStateResults
}

export default connectStateResults(SearchResults)
