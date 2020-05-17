import React from 'react'
import PropTypes from 'prop-types'
import { Stats } from 'react-instantsearch/dom'
import { connectStateResults } from 'react-instantsearch/connectors'
import ResultsList from './ResultsList'

function SearchResults({ searchState, searchResults, onSuggestionClick }) {
  return searchState.query && searchResults && searchResults.nbHits !== 0 ? (
    <div>
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
  onSuggestionClick: PropTypes.func.isRequired,
  searchResults: PropTypes.object // from connectStateResults
}

export default connectStateResults(SearchResults)
