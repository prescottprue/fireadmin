import React from 'react'
import PropTypes from 'prop-types'
import { size } from 'lodash'
import Card, { CardHeader, CardContent } from 'material-ui-next/Card'
import IconButton from 'material-ui-next/IconButton'
import Typography from 'material-ui-next/Typography'
import MoreVertIcon from 'material-ui-icons/MoreVert'
import classes from './MigrationTemplateListCard.scss'

export const MigrationTemplateListCard = ({
  name,
  description,
  actions,
  expanded,
  onClick
}) => (
  <Card className={classes.container} onClick={onClick}>
    <CardHeader
      action={
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      }
      title={name}
      subheader={description}
    />
    <CardContent>
      <Typography component="p">{size(actions)} Actions</Typography>
    </CardContent>
  </Card>
)

MigrationTemplateListCard.propTypes = {
  expanded: PropTypes.bool,
  onClick: PropTypes.func,
  name: PropTypes.string, // from enhancer (flattenProp - template)
  description: PropTypes.string, // from enhancer (flattenProp - template)
  actions: PropTypes.object // from enhancer (flattenProp - template)
}

export default MigrationTemplateListCard
