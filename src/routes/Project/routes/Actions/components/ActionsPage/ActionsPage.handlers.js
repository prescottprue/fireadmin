import { get, pick, invoke } from 'lodash'
import { firebasePaths } from 'constants'
import { pushAndWaitForStatus } from 'utils/firebaseFunctions'

export const runAction = props => async () => {
  const {
    firebase,
    firestore,
    params,
    auth,
    selectedTemplate,
    project,
    inputValues,
    toggleActionProcessing
  } = props
  // TODO: Show error notification if required action inputs are not selected
  props.closeTemplateEdit()
  toggleActionProcessing()
  props.showSuccess('Action Run Started!')

  const credentialFromInputValue = value => {
    const environmentKey = get(value, 'environmentKey')
    const { serviceAccount, databaseURL } = get(
      project,
      `environments.${environmentKey}`,
      {}
    )
    if (serviceAccount && databaseURL) {
      return { ...value, ...serviceAccount, databaseURL }
    }
    return value
  }
  try {
    // Write event to project events
    await firestore.add(
      {
        collection: 'projects',
        doc: get(params, 'projectId'),
        subcollections: [{ collection: 'events' }]
      },
      {
        eventType: 'startAction',
        templateId: get(selectedTemplate, 'templateId'),
        inputValues: inputValues.map(credentialFromInputValue),
        createdBy: auth.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }
    )
    // Push request to real time database and wait for response
    const res = await pushAndWaitForStatus(
      {
        firebase,
        requestPath: firebasePaths.actionRunnerRequests,
        responsePath: firebasePaths.actionRunnerResponses,
        pushObj: {
          projectId: get(params, 'projectId'),
          serviceAccountType: 'firestore',
          inputValues: inputValues.map(credentialFromInputValue),
          template: pick(selectedTemplate, ['steps', 'inputs'])
        }
      },
      responseSnap => {
        const { error, progress, completed } = invoke(responseSnap, 'val') || {}
        if (error) {
          toggleActionProcessing()
          return props.showError(error)
        }
        props.setActionProgress(progress)
        if (completed) {
          toggleActionProcessing()
          props.showSuccess('Action complete!')
        }
      },
      listenerError => {
        console.error('Error: ', listenerError.message || listenerError) // eslint-disable-line no-console
        toggleActionProcessing()
        props.showError('Error with action request')
      }
    )
    return res
  } catch (err) {
    console.error('Error: ', err.message || err) // eslint-disable-line no-console
    toggleActionProcessing()
    props.showError('Error with action request')
  }
}
