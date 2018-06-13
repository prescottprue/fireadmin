import React from 'react'
import PropTypes from 'prop-types'
import MenuItem from '@material-ui/core/MenuItem'
import { Highlight } from 'react-instantsearch/dom'

const SuggestedUser = ({ hit, onClick }) => (
  <MenuItem style={{ marginTop: '10px' }} onClick={() => onClick(hit)}>
    <span className="hit-name">
      <Highlight attributeName="displayName" hit={hit} />
    </span>
  </MenuItem>
)

SuggestedUser.propTypes = {
  hit: PropTypes.object,
  onClick: PropTypes.func
}

export default SuggestedUser
