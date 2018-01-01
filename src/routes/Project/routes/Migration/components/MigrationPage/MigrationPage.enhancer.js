import { get, invoke } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withStateHandlers, withHandlers, withProps } from 'recompose'
import { withNotifications } from 'modules/notification'
import { firebaseConnect, firestoreConnect, getVal } from 'react-redux-firebase'

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
      migrationProcessing: false,
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
      selectMigrationTemplate: ({ selectInstance }) => newSelectedTemplate => ({
        selectedTemplate: newSelectedTemplate,
        templateEditExpanded: false
      }),
      setCopyPath: ({ copyPath }) => e => ({
        copyPath: e.target.value
      }),
      toggleMigrationProcessing: ({ migrationProcessing }) => e => ({
        migrationProcessing: !migrationProcessing
      })
    }
  ),
  withHandlers({
    runMigration: props => async () => {
      const {
        firebase,
        params,
        project,
        toInstance,
        fromInstance,
        selectedTemplate,
        showSuccess,
        toggleMigrationProcessing,
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
        const pushRes = await firebase.pushWithMeta('requests/migration', {
          projectId: get(params, 'projectId'),
          serviceAccountType: 'storage',
          database1URL: environment1.databaseURL,
          database2URL: environment2.databaseURL,
          serviceAccount1Path: serviceAccount1.fullPath,
          serviceAccount2Path: serviceAccount2.fullPath,
          ...selectedTemplate
        })
        toggleMigrationProcessing()
        const pushKey = pushRes.key
        // TODO: Add watcher for progress
        // wait for response to be set (set by data migraiton function
        // after migration is complete)
        await new Promise((resolve, reject) => {
          firebase.ref(`responses/migration/${pushKey}`).on(
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
        toggleMigrationProcessing()
        showSuccess('Migration complete!')
        return pushKey
      } catch (err) {
        toggleMigrationProcessing()
        showError('Error with migration request')
      }
    }
  }),
  withProps(({ selectedTemplate }) => ({
    templateName: selectedTemplate
      ? `Template: ${get(selectedTemplate, 'name', '')}`
      : 'Template'
  }))
)
