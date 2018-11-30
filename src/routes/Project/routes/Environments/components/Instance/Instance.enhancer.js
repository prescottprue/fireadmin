import PropTypes from 'prop-types'
import { get } from 'lodash'
import { compose } from 'redux'
import {
  withStateHandlers,
  withHandlers,
  withProps,
  setPropTypes
} from 'recompose'
import { databaseURLToProjectName } from 'utils'
import { withStyles } from '@material-ui/core'
import styles from './Instance.styles'

export default compose(
  withStateHandlers(
    ({ initialAnchorEl = null }) => ({
      anchorEl: initialAnchorEl
    }),
    {
      closeMenu: () => () => ({
        anchorEl: null
      }),
      menuClick: () => e => ({
        anchorEl: e.target
      })
    }
  ),
  setPropTypes({
    onRemoveClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired
  }),
  withHandlers({
    editAndClose: ({ onEditClick, closeMenu }) => () => {
      closeMenu()
      onEditClick()
    },
    removeAndClose: ({ onRemoveClick, closeMenu }) => () => {
      onRemoveClick()
      closeMenu()
    }
  }),
  // Custom props
  withProps(({ onEditClick, closeMenu, instance }) => {
    const originalDesc = get(instance, 'description', '')
    const projectId = databaseURLToProjectName(get(instance, 'databaseURL', ''))
    return {
      instanceName: get(instance, 'name', ''),
      projectId,
      instanceDescription: originalDesc.length
        ? originalDesc.length > 50
          ? originalDesc.substring(0, 50).concat('...')
          : originalDesc
        : null
    }
  }),
  // Styles as props.classes
  withStyles(styles)
)
