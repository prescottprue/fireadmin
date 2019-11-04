import React from 'react'
import PropTypes from 'prop-types'
import { size } from 'lodash'
import MenuItem from '@material-ui/core/MenuItem'
import { Highlight } from 'react-instantsearch/dom'

function SuggestedItem({ hit, onClick }) {
  function handleClick() {
    onClick(hit)
  }

  return (
    <MenuItem
      style={{ marginTop: '10px' }}
      onClick={handleClick}
      data-test="search-result">
      <div className="flex-column">
        <span className="hit-name">
          <Highlight attributeName="name" hit={hit} />
        </span>
        <div
          className="flex-column"
          style={{ fontSize: '.75rem', color: '#757575' }}>
          <span>
            Steps: <strong>{size(hit.steps)}</strong>
          </span>
        </div>
      </div>
    </MenuItem>
  )
}

SuggestedItem.propTypes = {
  hit: PropTypes.object,
  onClick: PropTypes.func
}

export default SuggestedItem
