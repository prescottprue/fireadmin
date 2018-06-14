import React from 'react'
import PropTypes from 'prop-types'
import { size } from 'lodash'
import MenuItem from '@material-ui/core/Menu'
import { Highlight } from 'react-instantsearch/dom'

const SuggestedUser = ({ hit, onClick }) => (
  <MenuItem style={{ marginTop: '10px' }} onClick={() => onClick(hit)}>
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

SuggestedUser.propTypes = {
  hit: PropTypes.object,
  onClick: PropTypes.func
}

export default SuggestedUser
