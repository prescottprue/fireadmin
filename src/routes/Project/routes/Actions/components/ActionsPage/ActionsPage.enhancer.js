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
      const serviceAccount1Path = get(
        project,
        `environments.${fromInstance}.serviceAccount.fullPath`,
        null
      )
      const database1URL = get(
        project,
        `environments.${fromInstance}.databaseURL`,
        null
      )
      const database2URL = get(
        project,
        `environments.${toInstance}.databaseURL`,
        null
      )
      const serviceAccount2Path = get(
        project,
        `environments.${toInstance}.serviceAccount.fullPath`,
        null
      )
      // TODO: Show error notification if required action inputs are not selected
      try {
        // Push request to real time database
        const pushRes = await firebase.pushWithMeta(
          firebasePaths.actionRunnerRequests,
          {
            projectId: get(params, 'projectId'),
            serviceAccountType: 'storage',
            database1URL,
            database2URL,
            serviceAccount1Path,
            serviceAccount2Path,
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
