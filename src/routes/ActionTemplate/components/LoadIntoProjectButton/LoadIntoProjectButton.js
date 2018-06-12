import React from 'react'
import PropTypes from 'prop-types'
import classes from './LoadIntoProjectButton.scss'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

export const LoadIntoProjectButton = ({
  onProjectSelect,
  selectedProject,
  projects
}) => (
  <FormControl className={classes.container}>
    <InputLabel htmlFor="age-simple">Use In A Project</InputLabel>
    <Select
      value={selectedProject || ''}
      onChange={onProjectSelect}
      inputProps={{
        name: 'age',
        id: 'age-simple'
      }}>
      {projects &&
        projects.map((item, i) => (
          <MenuItem value={item.id} key={`${item.id}-${i}`}>
            {item.name}
          </MenuItem>
        ))}
    </Select>
  </FormControl>
)

LoadIntoProjectButton.propTypes = {
  onProjectSelect: PropTypes.func.isRequired, // from enhancer (firestoreConnect + connect)
  projects: PropTypes.array.isRequired, // from enhancer (firestoreConnect + connect)
  selectedProject: PropTypes.object
}

export default LoadIntoProjectButton
