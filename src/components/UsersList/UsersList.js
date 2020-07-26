import React from 'react'
import PropTypes from 'prop-types'
import PersonIcon from '@material-ui/icons/Person'
import Checkbox from '@material-ui/core/Checkbox'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'

function UsersList({ users, onUserClick }) {
  return (
    <List>
      {users.map((user, i) => (
        <ListItem
          key={`SelectedUser-${user.id || user.objectID}-${i}`}
          style={{ cursor: 'pointer' }}>
          <ListItemAvatar>
            {user.avatarUrl ? (
              <Avatar src={user.avatarUrl} />
            ) : (
              <Avatar>
                <PersonIcon />
              </Avatar>
            )}
          </ListItemAvatar>
          <ListItemText primary={user.displayName} secondary={user.email} />
          <ListItemSecondaryAction>
            <Checkbox
              edge="end"
              onChange={() => onUserClick(user)}
              checked={
                !!users.find(
                  (currentUser) =>
                    currentUser.objectID === user.id || user.objectID
                )
              }
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}

UsersList.propTypes = {
  users: PropTypes.array.isRequired,
  onUserClick: PropTypes.func.isRequired
}

export default UsersList
