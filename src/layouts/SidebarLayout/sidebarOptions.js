import React from 'react'
import LayersIcon from '@material-ui/icons/Layers'
import HomeIcon from '@material-ui/icons/Home'
import DeviceHubIcon from '@material-ui/icons/SettingsEthernet'
import StorageIcon from '@material-ui/icons/Dns'
import EventIcon from '@material-ui/icons/ViewList'
import PeopleIcon from '@material-ui/icons/People'
import {
  PROJECT_ENVIRONMENTS_PATH,
  PROJECT_ACTION_PATH,
  PROJECT_BUCKET_CONFIG_PATH,
  PROJECT_EVENTS_PATH,
  PROJECT_PERMISSIONS_PATH
} from 'constants/paths'

export default [
  {
    value: '',
    label: 'Project Overview',
    iconElement: <HomeIcon />
  },
  {
    value: PROJECT_ENVIRONMENTS_PATH,
    iconElement: <LayersIcon />
  },
  {
    value: PROJECT_ACTION_PATH,
    iconElement: <DeviceHubIcon />
  },
  {
    value: PROJECT_BUCKET_CONFIG_PATH,
    label: 'Bucket Config',
    iconElement: <StorageIcon />
  },
  {
    value: PROJECT_EVENTS_PATH,
    label: 'Events',
    iconElement: <EventIcon />
  },
  {
    value: PROJECT_PERMISSIONS_PATH,
    label: 'Users/Permissions',
    iconElement: <PeopleIcon />
  }
]
