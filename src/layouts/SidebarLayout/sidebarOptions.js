import React from 'react'
import LayersIcon from '@material-ui/icons/Layers'
import HomeIcon from '@material-ui/icons/Home'
import DeviceHubIcon from '@material-ui/icons/SettingsEthernet'
import StorageIcon from '@material-ui/icons/Dns'
import EventIcon from '@material-ui/icons/ViewList'
import { paths } from 'constants'

export default [
  {
    value: '',
    label: 'Project Overview',
    iconElement: <HomeIcon />
  },
  {
    value: paths.projectEnvironments,
    iconElement: <LayersIcon />
  },
  {
    value: paths.projectActions,
    iconElement: <DeviceHubIcon />
  },
  {
    value: paths.projectBucketConfig,
    label: 'Bucket Config',
    iconElement: <StorageIcon />
  },
  {
    value: paths.projectEvents,
    label: 'Events',
    iconElement: <EventIcon />
  }
]
