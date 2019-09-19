import React from 'react'
import PropTypes from 'prop-types'
import { flatMap } from 'lodash'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core/styles'
import styles from './PrivateActionTemplates.styles'

const useStyles = makeStyles(styles)

function PrivateActionTemplates({ templates, itemClickHandler }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
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
}

PrivateActionTemplates.propTypes = {
  templates: PropTypes.array, // from enhancer (firestoreConnect + connect)
  itemClickHandler: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default PrivateActionTemplates
