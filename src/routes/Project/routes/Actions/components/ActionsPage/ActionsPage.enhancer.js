import { get, map, some } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase, withFirestore } from 'react-redux-firebase'
import { formValueSelector } from 'redux-form'
import { formNames } from 'constants'
import { withStateHandlers, withHandlers, withProps } from 'recompose'
import { withNotifications } from 'modules/notification'
import * as handlers from './ActionsPage.handlers'

const selector = formValueSelector(formNames.actionRunner)

export default compose(
  withNotifications,
  withFirestore,
  withFirebase,
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
      templateEditExpanded: true,
      actionProcessing: false,
      actionProgress: null
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
      }),
      toggleActionProcessing: ({ actionProcessing }) => e => ({
        actionProcessing: !actionProcessing
      }),
      setActionProgress: ({ actionProcessing }) => stepStatus => ({
        actionProgress: !actionProcessing
      })
    }
  ),
  // Handlers as props
  withHandlers(handlers),
  withProps(({ selectedTemplate, actionProcessing, lockedEnvInUse }) => ({
    templateName: selectedTemplate
      ? `Template: ${get(selectedTemplate, 'name', '')}`
      : 'Template',
    runActionDisabled: !selectedTemplate || actionProcessing || lockedEnvInUse
  }))
)
