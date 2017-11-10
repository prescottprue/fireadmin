import React from 'react'
import PropTypes from 'prop-types'
import ActionsBoard from '../ActionsBoard'
import ActionsPicker from '../ActionsPicker'
import migrationEnhancer from 'routes/Migration/enhancer'
import classes from './MigrationPage.scss'

export const MigrationPage = ({ migration, selectedActions, addAction }) => (
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

MigrationPage.propTypes = {
  migration: PropTypes.object,
  selectedActions: PropTypes.array,
  addAction: PropTypes.func
}

export default migrationEnhancer(MigrationPage)
