import React from 'react'
import PropTypes from 'prop-types'
import { flatMap } from 'lodash'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import classes from './PrivateActionTemplates.scss'

export const PrivateActionTemplates = ({ templates, itemClickHandler }) => (
  <div className={classes.container}>
    <List component="nav">
      <Divider />
      {flatMap(templates, (item, idx) => [
        <ListItem
          button
          key={`PrivateTemplate-${item.id}-${idx}`}
          onClick={itemClickHandler(item)}>
          <ListItemText primary={item.name} />
        </ListItem>,
        <Divider key={`PrivateTemplateDivider-${item.id}-${idx}`} />
      ])}
    </List>
  </div>
)

PrivateActionTemplates.propTypes = {
  templates: PropTypes.array, // from enhancer (firestoreConnect + connect)
  itemClickHandler: PropTypes.func.isRequired
}

export default PrivateActionTemplates
