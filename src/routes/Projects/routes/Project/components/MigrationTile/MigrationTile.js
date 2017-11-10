import React from 'react'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import { get, map, first } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers, withHandlers } from 'recompose'
import { withFirebase } from 'react-redux-firebase'
import Paper from 'material-ui/Paper'
import MigrationInstanceTile from '../MigrationInstanceTile'
import classes from './MigrationTile.scss'

export const MigrationTile = ({
  title,
  instances,
  runMigration,
  selectFrom,
  fromInstance,
  toInstance,
  selectTo
}) => (
  <Paper className={classes.container}>
    <h2>Migration</h2>
    <div className={classes.button}>
      <RaisedButton label="Run Migration" onTouchTap={runMigration} />
    </div>
    <div className="flex-row-center">
      <div className={classes.tiles}>
        <MigrationInstanceTile
          title="From"
          instances={instances}
          selectedInstance={fromInstance}
          selectInstance={selectFrom}
        />
        <MigrationInstanceTile
          title="To"
          instances={instances}
          selectedInstance={toInstance}
          selectInstance={selectTo}
        />
      </div>
    </div>
  </Paper>
)

MigrationTile.propTypes = {
  title: PropTypes.string,
  instances: PropTypes.object,
  runMigration: PropTypes.func,
  selectFrom: PropTypes.func,
  fromInstance: PropTypes.string,
  toInstance: PropTypes.string,
  selectTo: PropTypes.func
}

export default compose(
  withFirebase,
  withStateHandlers(
    ({ initialSelected = null }) => ({
      fromInstance: initialSelected,
      toInstance: initialSelected
    }),
    {
      selectFrom: ({ selectInstance }) => (e, ind, newSelected) => ({
        fromInstance: newSelected
      }),
      selectTo: ({ selectInstance }) => (e, ind, newSelected) => ({
        toInstance: newSelected
      })
    }
  ),
  connect(({ firebase: { data } }) => ({
    serviceAccounts: data.serviceAccounts
  })),
  withHandlers({
    runMigration: ({
      firebase,
      toInstance,
      fromInstance,
      instances,
      params,
      serviceAccounts
    }) => () => {
      const instance = get(instances, `${toInstance}`)
      const serviceAccount = first(
        map(get(instance, 'serviceAccounts'), (_, key) =>
          get(serviceAccounts, `${params.projectId}.${key}`)
        )
      )
      return firebase.push('requests/migration', {
        databaseURL: instance.databaseURL,
        copyPath: 'instances',
        serviceAccount: serviceAccount.fullPath
      })
    }
  })
)(MigrationTile)
