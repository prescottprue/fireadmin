import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardTitle, CardText } from 'material-ui/Card'
// import classes from './NotificationsCard.scss'

export const NotificationsCard = ({ initiallyExpanded }) => (
  <Card
    style={{ width: '100%', marginTop: '2rem' }}
    initiallyExpanded={initiallyExpanded}>
    <CardTitle
      title="Notifications"
      subtitle="Notify relevant parties of migration completion (Analytics, Email, etc.)"
      actAsExpander
      showExpandableButton
    />
    <CardText expandable>Notification capability coming soon</CardText>
  </Card>
)

NotificationsCard.propTypes = {
  initiallyExpanded: PropTypes.bool
}

export default NotificationsCard
