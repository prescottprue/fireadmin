import React from 'react'
import PropTypes from 'prop-types'
import ActionsPicker from '../ActionsPicker'
import ActionsBoard from '../ActionsBoard'
import classes from './MigrationActionsTile.scss'

export const MigrationActionsTile = ({ selectedActions, addAction }) => (
  <div className={classes.container}>
    <div className={classes.sidebar}>
      <ActionsPicker />
    </div>
    <div className={classes.main}>
      <h2>Data Migration Actions</h2>
      <div className={classes.actionBoard}>
        <ActionsBoard actions={selectedActions} onActionDrop={addAction} />
      </div>
    </div>
  </div>
)

MigrationActionsTile.propTypes = {
  addAction: PropTypes.func,
  selectedActions: PropTypes.array
}

export default MigrationActionsTile
