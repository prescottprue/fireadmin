import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import {
  useFirestore,
  useFirestoreCollectionData,
  useDatabase,
  useDatabaseObjectData
} from 'reactfire'
import { get, map, startCase, invoke } from 'lodash'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import RedoIcon from '@material-ui/icons/Redo'
import { makeStyles } from '@material-ui/core/styles'
import { formatDateTime } from 'utils/formatters'
import { databaseURLToProjectName } from 'utils'
import NoRecentActions from './NoRecentActions'
import styles from './RecentActions.styles'

const useStyles = makeStyles(styles)

function RecentActions({ projectId, rerunAction }) {
  const classes = useStyles()
  const firestore = useFirestore()
  const database = useDatabase()
  const displayNamesRef = database.ref('displayNames')
  const environmentsRef = firestore.collection(
    `projects/${projectId}/environments`
  )
  const recentActionsQuery = firestore
    .collection(`projects/${projectId}/events`)
    .where('eventType', '==', 'requestActionRun')
    .orderBy('createdAt', 'desc')
    .limit(3)
  // const displayNames = useDatabaseObjectData(displayNamesRef)
  const displayNames = useDatabaseObjectData(displayNamesRef)
  const environments = useFirestoreCollectionData(environmentsRef)
  const recentActions = useFirestoreCollectionData(recentActionsQuery)
  const orderedActions = map(recentActions, (event) => {
    const createdBy = get(event, 'createdBy')
    const envLabelFromEnvironmentValIndex = (envIndex = 0) => {
      const envKey = get(event, `eventData.environmentValues.${envIndex}`)
      const envName = get(environments, `${envKey}.name`)
      const envUrl =
        get(environments, `${envKey}.databaseURL`) ||
        get(event, `eventData.inputValues.${envIndex}.databaseURL`, '')
      const firebaseProjectName = databaseURLToProjectName(envUrl)
      return `${envName} (${firebaseProjectName})`
    }
    if (createdBy) {
      return {
        ...event,
        src: envLabelFromEnvironmentValIndex(0),
        dest: envLabelFromEnvironmentValIndex(1),
        createdBy: get(displayNames, createdBy, createdBy)
      }
    }
    return event
  })

  if (!recentActions) {
    return <NoRecentActions />
  }

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Created By</TableCell>
            <TableCell>Template</TableCell>
            <TableCell>Source/Dest</TableCell>
            <TableCell>Input 1 Value</TableCell>
            <TableCell>Redo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(orderedActions, (action, groupName) => [
            <TableRow key={groupName} className={classes.tableRowDivider}>
              <TableCell>
                {formatDateTime(invoke(action, 'createdAt.toDate'))}
              </TableCell>
              <TableCell>
                <span>
                  {action.createdBy || startCase(action.createdByType)}
                </span>
              </TableCell>
              <TableCell>
                <span>{get(action, 'eventData.template.name', 'No Name')}</span>
              </TableCell>
              <TableCell>
                <span>
                  <strong>Source:</strong> {action.src}
                  <br />
                  <strong>Dest:</strong> {action.dest}
                </span>
              </TableCell>
              <TableCell>
                <span>
                  {get(
                    action,
                    'eventData.inputValues.2',
                    get(action, 'eventData.inputValues.0', 'No Path')
                  )}
                </span>
              </TableCell>
              <TableCell>
                <Tooltip
                  title={
                    <div>
                      <span style={{ marginLeft: '.3rem' }}>Rerun Action</span>
                      <br />
                      <span>(Same Settings)</span>
                    </div>
                  }>
                  <IconButton
                    onClick={() => rerunAction(action)}
                    color="secondary"
                    className={classes.submit}
                    data-test="redo-action-button">
                    <RedoIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ])}
        </TableBody>
      </Table>
    </Paper>
  )
}

RecentActions.propTypes = {
  projectId: PropTypes.string.isRequired,
  rerunAction: PropTypes.func.isRequired
}

export default RecentActions
