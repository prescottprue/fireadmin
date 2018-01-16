import { get, pick } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { withStateHandlers, withHandlers, withProps } from 'recompose'
import { firestoreConnect } from 'react-redux-firebase'
import { firebasePaths, formNames } from 'constants'
import { withNotifications } from 'modules/notification'
import { pushAndWaitForReponse } from 'utils/firebaseFunctions'

const actionRunnerFormSelector = formValueSelector(formNames.actionRunner)

export default compose(
  withNotifications,
  firestoreConnect(({ params }) => [
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'environments' }]
    },
    {
      collection: 'projects',
      doc: params.projectId
    }
  ]),
  connect((state, { params }) => ({
    auth: state.firebase.auth,
    inputValues: actionRunnerFormSelector(state, 'inputValues'),
    project: get(state.firestore, `data.projects.${params.projectId}`)
  })),
  withStateHandlers(
    ({ initialSelected = null }) => ({
      fromInstance: initialSelected,
      toInstance: initialSelected,
      templateEditExpanded: true,
      actionProcessing: false,
      copyPath: null,
      configExpanded: true,
      instances: null
    }),
    {
      selectFrom: ({ selectInstance }) => (e, ind, newSelected) => ({
        fromInstance: newSelected
      }),
      selectTo: ({ selectInstance }) => (e, ind, newSelected) => ({
        toInstance: newSelected
      }),
      toggleTemplateEdit: ({ templateEditExpanded }) => () => ({
        templateEditExpanded: !templateEditExpanded
      }),
      toggleConfig: ({ templateEditExpanded }) => () => ({
        configExpanded: !templateEditExpanded
      }),
      selectActionTemplate: ({ selectInstance }) => newSelectedTemplate => ({
        selectedTemplate: newSelectedTemplate,
        templateEditExpanded: false
      }),
      setCopyPath: ({ copyPath }) => e => ({
        copyPath: e.target.value
      }),
      toggleActionProcessing: ({ actionProcessing }) => e => ({
        actionProcessing: !actionProcessing
      })
    }
  ),
  withHandlers({
    runAction: props => async () => {
      const {
        firebase,
        params,
        selectedTemplate,
        showSuccess,
        inputValues,
        toggleActionProcessing,
        showError
      } = props
      // TODO: Show error notification if required action inputs are not selected
      toggleActionProcessing()
      try {
        // Push request to real time database and wait for response
        // TODO: Add watcher for progress
        const res = await pushAndWaitForReponse({
          firebase,
          requestPath: firebasePaths.actionRunnerRequests,
          responsePath: firebasePaths.actionRunnerResponses,
          pushObj: {
            projectId: get(params, 'projectId'),
            serviceAccountType: 'storage',
            inputValues,
            template: pick(selectedTemplate, ['steps', 'inputs'])
          },
          afterPush: toggleActionProcessing
        })
        toggleActionProcessing()
        showSuccess('Action complete!')
        return res
      } catch (err) {
        toggleActionProcessing()
        showError('Error with action request')
        console.error('Error: ', err.message || err) // eslint-disable-line no-console
      }
    }
  }),
  withProps(({ selectedTemplate }) => ({
    templateName: selectedTemplate
      ? `Template: ${get(selectedTemplate, 'name', '')}`
      : 'Template'
  }))
)
