/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { connectHits } from 'react-instantsearch/connectors'
import List from '@material-ui/core/List'
import SuggestedUser from './SuggestedUser'

function ResultsList({ hits, onSuggestionClick }) {
  return (
    <List>
      {hits.map((hit, i) => (
        <SuggestedUser
          key={`Hit-${hit.objectID}-${i}`}
          id={hit.objectID}
          hit={hit}
          onClick={onSuggestionClick}
        />
      ))}
    </List>
  )
}

ResultsList.propTypes = {
  hits: PropTypes.array, // from connectHits
  onSuggestionClick: PropTypes.func // from UsersSearch
}

export default connectHits(ResultsList)
