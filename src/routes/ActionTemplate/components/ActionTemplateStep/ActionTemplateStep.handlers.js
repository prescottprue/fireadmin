const DEFAULT_NEW_STEP_TYPE = 'copy'

/**
 * Add step click handler which calls redux-form's fields.push to add a field
 * with the default new step type
 * @param {Object} props - Component props
 */
export function addStepClick(props) {
  return () => {
    props.fields.push({ type: DEFAULT_NEW_STEP_TYPE })
  }
}
