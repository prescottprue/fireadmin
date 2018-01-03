import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import Card, {
  CardActions,
  CardHeader,
  CardContent
} from 'material-ui-next/Card'
import Typography from 'material-ui-next/Typography'
import Button from 'material-ui-next/Button'
import classes from './Instance.scss'

const databaseURLToProjectName = databaseURL =>
  databaseURL.replace('https://', '').replace('.firebaseio.com', '')

export const Instance = ({ instance, onRemoveClick, onEditClick }) => (
  <div className={classes.container}>
    <Card className={classes.card}>
      <CardHeader
        title={instance.name}
        subheader={databaseURLToProjectName(get(instance, 'databaseURL', ''))}
      />
      <CardContent>
        <Typography>{get(instance, 'description', null)}</Typography>
      </CardContent>
      <CardActions>
        <Button color="primary" onClick={onEditClick}>
          Edit
        </Button>
        <Button color="accent" onClick={onRemoveClick}>
          Remove
        </Button>
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
