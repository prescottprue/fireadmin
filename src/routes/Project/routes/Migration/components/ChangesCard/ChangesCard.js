import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import MigrationEditor from '../MigrationEditor'
// import classes from './ChangesCard.scss'

export const ChangesCard = ({ initiallyExpanded, params }) => (
  <Card
    style={{ width: '100%', marginTop: '2rem' }}
    initiallyExpanded={initiallyExpanded}>
    <CardTitle
      title="Changes"
      subtitle="Add, Update, Map, or Remove Data"
      actAsExpander
      showExpandableButton
    />
    <CardText expandable>
      <h4>Custom Logic</h4>
      <MigrationEditor params={params} />
    </CardText>
  </Card>
)

ChangesCard.propTypes = {
  initiallyExpanded: PropTypes.bool,
  params: PropTypes.object.isRequired
}

export default ChangesCard
