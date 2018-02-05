import React from 'react'
import PropTypes from 'prop-types'
import { size } from 'lodash'
import { connect } from 'react-redux'
import { pure, compose, renderNothing, branch } from 'recompose'
import Snackbar from 'material-ui/Snackbar'
import IconButton from 'material-ui/IconButton'
import CloseIcon from 'material-ui-icons/Close'
import Fade from 'material-ui/transitions/Fade'
import * as actions from '../actions'

const closeIconStyle = { paddingTop: '5px', height: '30px', color: 'white' }

export const Notifications = ({ allIds, byId, dismissNotification }) => (
  <div>
    {allIds.map(id => (
      <Snackbar
        key={id}
        open
        transition={Fade}
        action={
          <IconButton color="default" onClick={() => dismissNotification(id)}>
            <CloseIcon style={closeIconStyle} />
          </IconButton>
        }
        message={byId[id].message}
      />
    ))}
  </div>
)

Notifications.propTypes = {
  allIds: PropTypes.array.isRequired,
  byId: PropTypes.object.isRequired,
  dismissNotification: PropTypes.func.isRequired
}

export default compose(
  pure,
  connect(({ notifications: { allIds, byId } }) => ({ allIds, byId }), actions),
  branch(props => !size(props.allIds), renderNothing) // only render if notifications exist
)(Notifications)
