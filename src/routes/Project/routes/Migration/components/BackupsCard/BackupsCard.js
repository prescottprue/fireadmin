import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardTitle, CardText } from 'material-ui/Card'
import BackupInstanceTile from '../BackupInstanceTile'
import classes from './BackupsCard.scss'

export const BackupsCard = ({
  title,
  environments,
  selectedInstance,
  selectInstance
}) => (
  <Card style={{ width: '100%', marginTop: '2rem' }} initiallyExpanded>
    <CardTitle
      title="Backups"
      subtitle="Perserving data is always the first step of any safe migration"
      actAsExpander
      showExpandableButton
    />
    <CardText expandable>
      <div className={classes.tiles}>
        <BackupInstanceTile
          title="Source"
          {...{ environments, selectedInstance, selectInstance }}
        />
        <BackupInstanceTile
          title="Destination"
          {...{ environments, selectedInstance, selectInstance }}
        />
      </div>
    </CardText>
  </Card>
)

BackupsCard.propTypes = {
  title: PropTypes.string,
  environments: PropTypes.object,
  selectedInstance: PropTypes.string,
  selectInstance: PropTypes.func
}

export default BackupsCard
