import React from 'react'
import PropTypes from 'prop-types'
import { omit } from 'lodash'
import { DragSource } from 'react-dnd'
import classes from './ActionChip.scss'

/**
 * Implements the drag source contract.
 */
const cardSource = {
  beginDrag(props) {
    return omit(props, ['icon'])
  },
  endDrag(props, monitor) {
    const didDrop = monitor.didDrop()
    if (!didDrop) {
      console.log('Error did not drop!', props) // eslint-disable-line no-console
    } else {
      props.onDrop && props.onDrop({ ...props })
    }
  }
}

export const ActionChip = ({ label, icon, connectDragSource }) =>
  connectDragSource(
    <div className={classes.container}>
      {icon}
      <span className={classes.label}>{label}</span>
    </div>
  )

ActionChip.propTypes = {
  migration: PropTypes.object
}

export default DragSource('action', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(ActionChip)
