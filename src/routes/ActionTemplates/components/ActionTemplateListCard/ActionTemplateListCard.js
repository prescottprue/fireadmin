import React from 'react'
import PropTypes from 'prop-types'
import { size } from 'lodash'
import Card, { CardHeader, CardContent } from 'material-ui/Card'
import IconButton from 'material-ui/IconButton'
import Typography from 'material-ui/Typography'
import MoreVertIcon from 'material-ui-icons/MoreVert'

export const ActionTemplateListCard = ({
  name,
  truncatedDescription,
  steps,
  expanded,
  onClick,
  classes
}) => (
  <Card className={classes.card} onClick={onClick}>
    <CardHeader
      action={
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      }
      title={name}
      subheader={`${size(steps)} Steps`}
    />
    <CardContent className={classes.media}>
      <Typography component="p">{truncatedDescription}</Typography>
    </CardContent>
  </Card>
)

ActionTemplateListCard.propTypes = {
  expanded: PropTypes.bool,
  onClick: PropTypes.func,
  name: PropTypes.string, // from enhancer (flattenProp - template)
  steps: PropTypes.array, // from enhancer (flattenProp - template)
  truncatedDescription: PropTypes.string, // from enhancer (withProps)
  classes: PropTypes.object.isRequired // from enhancer (withStyles - template)
}

export default ActionTemplateListCard
