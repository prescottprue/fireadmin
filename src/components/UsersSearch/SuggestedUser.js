import React from 'react'
import PropTypes from 'prop-types'
import { Highlight } from 'react-instantsearch/dom'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

function SuggestedUser({ hit, onClick }) {
  return (
    <ListItem onClick={() => onClick(hit)} style={{ cursor: 'pointer' }}>
      <ListItemText
        primary={<Highlight attribute="displayName" hit={hit} />}
        // secondary={<Highlight attributeName="email" hit={hit} />}
      />
    </ListItem>
  )
}

SuggestedUser.propTypes = {
  hit: PropTypes.object,
  onClick: PropTypes.func
}

export default SuggestedUser
