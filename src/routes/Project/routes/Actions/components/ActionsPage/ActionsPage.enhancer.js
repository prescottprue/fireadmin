import PropTypes from 'prop-types'
import { get, map, some } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase, withFirestore } from 'react-redux-firebase'
import { formValueSelector } from 'redux-form'
import { formNames } from 'constants'
import {
  withStateHandlers,
  withHandlers,
  withProps,
  setPropTypes
} from 'recompose'
import { withNotifications } from 'modules/notification'
import * as handlers from './ActionsPage.handlers'

const selector = formValueSelector(formNames.actionRunner)

export default compose(
  withNotifications,
  withFirestore,
  withFirebase,
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
    return {
      uid: firebase.auth.uid,
      project: get(data, `projects.${params.projectId}`),
      environments: get(ordered, `environments-${params.projectId}`),
      lockedEnvInUse: some(
        map(selector(state, 'environmentValues'), envInd =>
          get(
            state.firestore.ordered,
            `environments-${params.projectId}.${envInd}`
          )
        ),
        { locked: true }
      )
    }
  }),
  // State handlers as props
  withStateHandlers(
    () => ({
      templateEditExpanded: true
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
        templateEditExpanded: false
      }),
      clearRunner: () => () => ({
        selectedTemplate: null,
        templateEditExpanded: true
      })
    }
  ),
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
