import { invoke } from 'lodash'

/**
 * Handler to handle clicking edit by invoke props.onSelect passing
 * props.project.
 * @param {Object} props - Component props
 */
export function handleEditClick(props) {
  return () => invoke(props, 'onSelect', props.project)
}
