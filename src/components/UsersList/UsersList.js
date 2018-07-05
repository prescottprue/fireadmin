import React from 'react'
import PropTypes from 'prop-types'
import { find } from 'lodash'
import PersonIcon from '@material-ui/icons/Person'
import Checkbox from '@material-ui/core/Checkbox'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
// import classes from './UsersList.scss'

export const UsersList = ({ users, onUserClick }) => (
  <List>
    {users.map((user, i) => (
      <ListItem key={`SelectedUser-${user.id || user.objectID}-${i}`}>
        <PersonIcon />
        <ListItemText primary={user.displayName} />
        <ListItemSecondaryAction>
          <Checkbox
            onChange={() => onUserClick(user)}
            checked={
              !!find(users, {
                objectID: user.id || user.objectID
              })
            }
          />
        </ListItemSecondaryAction>
      </ListItem>
    ))}
  </List>
)

UsersList.propTypes = {
  users: PropTypes.array.isRequired,
  onUserClick: PropTypes.func.isRequired
}

export default UsersList
