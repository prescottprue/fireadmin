import React from 'react'
import PropTypes from 'prop-types'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

function DocsSideBarItem({ title, docsModule, classes }) {
  return (
    <ListItem button>
      <ListItemText inset primary={title} />
    </ListItem>
  )
}

DocsSideBarItem.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  docsModule: PropTypes.object,
  name: PropTypes.string
}

export default DocsSideBarItem
