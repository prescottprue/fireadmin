import React from 'react'
import { map } from 'lodash'
import PropTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Avatar from 'material-ui/Avatar'
import List, {
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import ServiceAccountIcon from 'material-ui-icons/SupervisorAccount'
import { formatDate } from 'utils/formatters'
// import classes from './ServiceAccounts.scss'

const styles = theme => ({
  root: {
    width: '100%',
    background: theme.palette.background.paper,
    marginBottom: '1.5rem'
  }
})

export const ServiceAccounts = ({
  serviceAccounts,
  onAccountClick,
  classes,
  selectedAccountKey
}) => (
  <div className={classes.root}>
    <List>
      {map(serviceAccounts, (account, idx) => (
        <ListItem
          button
          key={`${account.id}-${idx}`}
          onClick={() => onAccountClick(account.id, account)}>
          <Avatar>
            <ServiceAccountIcon />
          </Avatar>
          <ListItemText
            primary={account.name}
            secondary={`Uploaded On: ${formatDate(account.createdAt)}`}
          />
          <ListItemSecondaryAction>
            <Checkbox
              onChange={() => onAccountClick(account.id, account)}
              checked={selectedAccountKey === account.id}
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  </div>
)

ServiceAccounts.propTypes = {
  serviceAccounts: PropTypes.array.isRequired, // from enhancer
  selectedAccountKey: PropTypes.string,
  classes: PropTypes.object, // from withStyles
  onAccountClick: PropTypes.func.isRequired
}

export default withStyles(styles)(ServiceAccounts)
