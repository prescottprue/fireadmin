import PropTypes from 'prop-types'
import { get, map, some, findIndex } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withFirestore from 'react-redux-firebase/lib/withFirestore'
import withFirebase from 'react-redux-firebase/lib/withFirebase'
import { formValueSelector } from 'redux-form'
import { formNames } from 'constants'
import {
  withStateHandlers,
  withHandlers,
  withProps,
  setDisplayName,
  setPropTypes
} from 'recompose'
import { withNotifications } from 'modules/notification'
import * as handlers from './ActionsPage.handlers'

function instanceTypeInUse(environments, type = 'src') {
  const lockedEnvIndex = findIndex(environments, {
    [`${type}Only`]: true
  })
  if (lockedEnvIndex === -1) {
    return false
  }
  return type === 'src' ? lockedEnvIndex === 0 : lockedEnvIndex === 1
}

function getLockedEnvInUse(environments) {
  if (!environments.length) {
    return false
  }
  // TODO: Make this aware of if the action template is a copy or not
  // TODO: Make this aware of if the position is actually src/dest instead of using index
  return (
    some(environments, 'locked') ||
    instanceTypeInUse(environments, 'read') ||
    instanceTypeInUse(environments, 'write')
  )
}

export default compose(
  setDisplayName('EnhancedActionsPage'),
  withNotifications,
  withFirestore,
  withFirebase,
  // Proptypes for props used in HOCs
  setPropTypes({
    params: PropTypes.shape({
      projectId: PropTypes.string.isRequired
    }),
    firebase: PropTypes.shape({
      pushWithMeta: PropTypes.func.isRequired // used in handlers
    }),
    firestore: PropTypes.shape({
      add: PropTypes.func.isRequired // used in handlers
    }),
    showMessage: PropTypes.func.isRequired // used in handlers
  }),
  // Map redux state to props
  connect((state, { params }) => {
    const {
      firebase,
      firestore: { data, ordered }
    } = state
    const formSelector = formValueSelector(formNames.actionRunner)
    const environmentValues = formSelector(state, 'environmentValues')
    const environmentsById = get(data, `environments-${params.projectId}`)
    // Populate selected keys from form into list of environment objects
    const selectedEnvironments = map(environmentValues, envKey =>
      get(data, `environments-${params.projectId}.${envKey}`)
    )
    return {
      uid: firebase.auth.uid,
      project: get(data, `projects.${params.projectId}`),
      environments: get(ordered, `environments-${params.projectId}`),
      environmentsById,
      lockedEnvInUse: getLockedEnvInUse(selectedEnvironments)
    }
  }),
  // State handlers as props
  withStateHandlers(
    () => ({
      templateEditExpanded: true,
      // Values for ActionRunnerForm at this level so they can be cleared
      // during actionRunner submission
      inputsExpanded: true,
      stepsExpanded: true,
      environmentsExpanded: true
    }),
    {
      toggleTemplateEdit: ({ templateEditExpanded }) => () => ({
        templateEditExpanded: !templateEditExpanded
      }),
      closeTemplateEdit: () => () => ({
        templateEditExpanded: false
      }),
      selectActionTemplate: () => newSelectedTemplate => ({
        selectedTemplate: newSelectedTemplate,
        templateEditExpanded: false,
        inputsExpanded: true,
        stepsExpanded: true,
        environmentsExpanded: true
      }),
      clearRunner: () => () => ({
        selectedTemplate: null,
        templateEditExpanded: true
      }),
      // Sections of ActionRunnerForm at this level so that they can be cleared
      // during actionRunner submission
      toggleInputs: ({ inputsExpanded }) => () => ({
        inputsExpanded: !inputsExpanded
      }),
      toggleEnvironments: ({ environmentsExpanded }) => () => ({
        environmentsExpanded: !environmentsExpanded
      }),
      toggleSteps: ({ stepsExpanded }) => () => ({
        stepsExpanded: !stepsExpanded
      }),
      closeRunnerSections: () => () => ({
        stepsExpanded: false,
        inputsExpanded: false,
        environmentsExpanded: false
      })
    }
  ),
  // Custom props
  withProps(({ selectedTemplate, lockedEnvInUse, params }) => ({
    templateName: selectedTemplate
      ? `Template: ${get(selectedTemplate, 'name', '')}`
      : 'Template',
    runActionDisabled: !selectedTemplate || lockedEnvInUse,
    projectId: params.projectId
  })),
  // Handlers as props
  withHandlers(handlers)
)
