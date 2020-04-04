import PropTypes from 'prop-types'
import { get, map, some, findIndex } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withFirestore from 'react-redux-firebase/lib/withFirestore'
import withFirebase from 'react-redux-firebase/lib/withFirebase'
import { formValueSelector } from 'redux-form'
import { ACTION_RUNNER_FORM_NAME } from 'constants/formNames'
import { withHandlers, withProps, setPropTypes } from 'recompose'
import * as handlers from './ActionsPage.handlers'

function instanceTypeInUse(environments, type = 'src') {
  const lockedEnvIndex = findIndex(environments, {
    [`${type}Only`]: true
  })
  if (lockedEnvIndex === -1) {
    return false
  }
  // TODO: Make this aware of if the position is actually src/dest based on template instead of using index
  return type === 'src' ? lockedEnvIndex === 0 : lockedEnvIndex === 1
}

function getLockedEnvInUse(environments) {
  if (!environments.length) {
    return false
  }
  // TODO: Make this aware of if the action template is a copy or not
  return (
    some(environments, 'locked') ||
    instanceTypeInUse(environments, 'read') ||
    instanceTypeInUse(environments, 'write')
  )
}

export default compose(
  withFirestore,
  withFirebase,
  // Proptypes for props used in HOCs
  setPropTypes({
    projectId: PropTypes.string.isRequired,
    firebase: PropTypes.shape({
      pushWithMeta: PropTypes.func.isRequired // used in handlers
    }),
    firestore: PropTypes.shape({
      add: PropTypes.func.isRequired // used in handlers
    }),
    showMessage: PropTypes.func.isRequired // used in handlers
  }),
  // Map redux state to props
  connect((state, { projectId }) => {
    const {
      firebase: { auth },
      firestore: { data, ordered }
    } = state
    const formSelector = formValueSelector(ACTION_RUNNER_FORM_NAME)
    const environmentValues = formSelector(state, 'environmentValues')
    const environmentsById = get(data, `environments-${projectId}`)
    // Populate selected keys from form into list of environment objects
    const selectedEnvironments = map(environmentValues, (envKey) =>
      get(data, `environments-${projectId}.${envKey}`)
    )
    return {
      uid: auth.uid,
      project: get(data, `projects.${projectId}`),
      environments: get(ordered, `environments-${projectId}`),
      environmentsById,
      lockedEnvInUse: getLockedEnvInUse(selectedEnvironments)
    }
  }),
  // Custom props
  withProps(({ selectedTemplate, lockedEnvInUse }) => ({
    templateName: selectedTemplate
      ? `Template: ${get(selectedTemplate, 'name', '')}`
      : 'Template',
    runActionDisabled: !selectedTemplate || lockedEnvInUse
  })),
  // Handlers as props
  withHandlers(handlers)
)
