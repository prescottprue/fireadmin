import { get, invoke } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers, withHandlers, withProps } from 'recompose'
import { withNotifications } from 'modules/notification'
import { firebaseConnect, firestoreConnect, getVal } from 'react-redux-firebase'
import { firebasePaths } from 'constants'

export default compose(
  withNotifications,
  firebaseConnect(({ params }) => [`serviceAccounts/${params.projectId}`]),
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
  connect(({ firebase, firestore: { data } }, { params }) => ({
    auth: firebase.auth,
    project: get(data, `projects.${params.projectId}`),
    serviceAccounts: getVal(
      firebase,
      `data/serviceAccounts/${params.projectId}`
    )
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
        project,
        toInstance,
        fromInstance,
        selectedTemplate,
        showSuccess,
        toggleActionProcessing,
        showError
      } = props
      const serviceAccount1 = get(
        project,
        `environments.${fromInstance}.serviceAccount`
      )
      const environment1 = get(project, `environments.${fromInstance}`)
      const serviceAccount2 = get(
        project,
        `environments.${toInstance}.serviceAccount`
      )
      const environment2 = get(project, `environments.${toInstance}`)
      // Show error notification if either service account is missing
      if (!serviceAccount1 || !serviceAccount2) {
        return props.showError('Service Account Not found')
      }
      try {
        // Push request to real time database
        const pushRes = await firebase.pushWithMeta(
          firebasePaths.actionRunnerRequests,
          {
            projectId: get(params, 'projectId'),
            serviceAccountType: 'storage',
            database1URL: environment1.databaseURL,
            database2URL: environment2.databaseURL,
            serviceAccount1Path: serviceAccount1.fullPath,
            serviceAccount2Path: serviceAccount2.fullPath,
            ...selectedTemplate
          }
        )
        toggleActionProcessing()
        const pushKey = pushRes.key
        // TODO: Add watcher for progress
        // wait for response to be set (set by data migraiton function
        // after action is complete)
        await new Promise((resolve, reject) => {
          firebase.ref(`${firebasePaths.actionRunnerResponses}/${pushKey}`).on(
            'value',
            snap => {
              const refVal = invoke(snap, 'val')
              if (refVal) {
                resolve(refVal)
              }
            },
            err => {
              reject(err)
            }
          )
        })
        toggleActionProcessing()
        showSuccess('Action complete!')
        return pushKey
      } catch (err) {
        toggleActionProcessing()
        showError('Error with action request')
      }
    }
  }),
  withProps(({ selectedTemplate }) => ({
    templateName: selectedTemplate
      ? `Template: ${get(selectedTemplate, 'name', '')}`
      : 'Template'
  }))
)
