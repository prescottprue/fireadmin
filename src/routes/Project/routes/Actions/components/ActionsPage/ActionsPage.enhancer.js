import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { withStateHandlers, withHandlers, withProps } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { formNames } from 'constants'
import { withNotifications } from 'modules/notification'
import * as handlers from './ActionsPage.handlers'

const actionRunnerFormSelector = formValueSelector(formNames.actionRunner)

export default compose(
  withNotifications,
  // Create listeners for Firestore
  firestoreConnect(({ params }) => [
    // Project environments
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'environments' }]
    },
    // Project
    {
      collection: 'projects',
      doc: params.projectId
    }
  ]),
  // Map redux state to props
  connect((state, { params }) => ({
    auth: state.firebase.auth,
    inputValues: actionRunnerFormSelector(state, 'inputValues'),
    project: get(state.firestore, `data.projects.${params.projectId}`)
  })),
  withStateHandlers(
    () => ({
      templateEditExpanded: true,
      actionProcessing: false,
      actionProgress: null,
      copyPath: null,
      configExpanded: true,
      instances: null
    }),
    {
      toggleTemplateEdit: ({ templateEditExpanded }) => () => ({
        templateEditExpanded: !templateEditExpanded
      }),
      closeTemplateEdit: ({ templateEditExpanded }) => () => ({
        templateEditExpanded: false
      }),
      toggleConfig: ({ templateEditExpanded }) => () => ({
        configExpanded: !templateEditExpanded
      }),
      selectActionTemplate: ({ selectInstance }) => newSelectedTemplate => ({
        selectedTemplate: newSelectedTemplate,
        templateEditExpanded: false
      }),
      setCopyPath: ({ copyPath }) => e => ({ copyPath: e.target.value }),
      toggleActionProcessing: ({ actionProcessing }) => e => ({
        actionProcessing: !actionProcessing
      }),
      setActionProgress: ({ actionProcessing }) => stepStatus => ({
        actionProgress: !actionProcessing
      })
    }
  ),
  withHandlers(handlers),
  withProps(({ selectedTemplate }) => ({
    templateName: selectedTemplate
      ? `Template: ${get(selectedTemplate, 'name', '')}`
      : 'Template'
  }))
)
