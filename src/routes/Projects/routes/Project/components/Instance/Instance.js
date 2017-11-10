import React from 'react'
import PropTypes from 'prop-types'
import { size } from 'lodash'
import { Card, CardActions, CardTitle, CardText } from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import classes from './Instance.scss'

export const Instance = ({ instance, onRemoveClick, onEditClick }) => (
  <div className={classes.container}>
    <Card className={classes.card}>
      <CardTitle
        title={instance.name}
        subtitle={instance.description || instance.name}
      />
      <CardText>Service Accounts: {size(instance.serviceAccounts)}</CardText>
      <CardActions>
        <FlatButton label="Edit" onTouchTap={onEditClick} />
        <FlatButton label="Remove" onTouchTap={onRemoveClick} />
      </CardActions>
    </Card>
  </div>
)

Instance.propTypes = {
  instance: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onRemoveClick: PropTypes.func,
  onEditClick: PropTypes.func
}

export default Instance
