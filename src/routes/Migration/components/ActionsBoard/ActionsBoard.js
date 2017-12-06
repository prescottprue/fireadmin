import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { map, size, invoke } from 'lodash'
import { DropTarget } from 'react-dnd'
import ActionCard from '../ActionCard'
import classes from './ActionsBoard.scss'

const squareTarget = {
  canDrop(props) {
    return true
  },

  drop(props, monitor, component) {
    invoke(props, 'onActionDrop', monitor.getItem())
    return { moved: true }
  }
}

@DropTarget('action', squareTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class ActionsBoard extends Component {
  static propTypes = {
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    actions: PropTypes.array,
    onActionDrop: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    connectDropTarget: PropTypes.func.isRequired
    // children: PropTypes.node,
  }

  renderOverlay(color) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          zIndex: 1,
          opacity: 0.5,
          backgroundColor: color
        }}
      />
    )
  }

  render() {
    const { connectDropTarget, isOver, canDrop, actions } = this.props
    const classNameForActions = size(actions) ? classes.empty : ''
    return (
      <div>
        {connectDropTarget(
          <div className={`${classes.container} ${classNameForActions}`}>
            {map(actions, (action, key) => (
              <ActionCard key={`SelectedAction-${key}`} label={action.label} />
            ))}
            <div className={classes.new}>
              <span>Drop {!!size(actions) && 'More '}Actions Here</span>
              {isOver && !canDrop && <span>asdfasdf</span>}
              {/* {!isOver && canDrop && this.renderOverlay('yellow')} */}
              {isOver && canDrop && this.renderOverlay('green')}
            </div>
          </div>
        )}
      </div>
    )
  }
}
