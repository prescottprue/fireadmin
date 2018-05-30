import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirebase, withFirestore } from 'react-redux-firebase'
import { withStateHandlers, withHandlers, withProps } from 'recompose'
import { withNotifications } from 'modules/notification'
import * as handlers from './ActionsPage.handlers'

export default compose(
  withNotifications,
  withFirestore,
  withFirebase,
  // Map redux state to props
  connect(({ firebase, firestore: { data, ordered } }, { params }) => ({
    uid: firebase.auth.uid,
    project: get(data, `projects.${params.projectId}`),
    environments: get(ordered, `environments-${params.projectId}`)
  })),
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
  withProps(({ selectedTemplate }) => ({
    templateName: selectedTemplate
      ? `Template: ${get(selectedTemplate, 'name', '')}`
      : 'Template'
  }))
)
