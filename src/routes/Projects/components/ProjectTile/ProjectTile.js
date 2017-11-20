import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui-next/Paper'
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import { isObject } from 'lodash'
import classes from './ProjectTile.scss'

export const ProjectTile = ({ project, onSelect, onDelete }) => (
  <Paper className={classes.container}>
    <div className={classes.top}>
      <span className={classes.name} onClick={() => onSelect(project)}>
        {project.name}
      </span>
      {onDelete ? (
        <IconButton tooltip="delete" onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      ) : null}
    </div>
    <span className={classes.owner}>
      {isObject(project.createdBy)
        ? project.createdBy.displayName
        : project.createdBy || 'No Owner'}
    </span>
  </Paper>
)

ProjectTile.propTypes = {
  project: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func
}

export default ProjectTile
