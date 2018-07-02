/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { connectHits } from 'react-instantsearch/connectors'
import MenuList from '@material-ui/core/MenuList'
import SuggestedItem from './SuggestedItem'

const ResultsList = ({ hits, onSuggestionClick }) => (
  <div>
    <MenuList>
      {hits.map((hit, i) => (
        <SuggestedItem
          key={`Hit-${hit.objectID}-${i}`}
          hit={hit}
          onClick={onSuggestionClick}
        />
      ))}
    </MenuList>
  </div>
)

ResultsList.propTypes = {
  hits: PropTypes.array, // from connectHits
  onSuggestionClick: PropTypes.func // from UsersSearch
}

export default connectHits(ResultsList)
