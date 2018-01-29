import { get, pick } from 'lodash'
import { firebasePaths } from 'constants'
import { pushAndWaitForReponse } from 'utils/firebaseFunctions'

export const runAction = props => async () => {
  const {
    firebase,
    firestore,
    params,
    auth,
    selectedTemplate,
    showSuccess,
    inputValues,
    toggleActionProcessing,
    showError
  } = props
  // TODO: Show error notification if required action inputs are not selected
  toggleActionProcessing()
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
        inputValues,
        createdBy: auth.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }
    )
    // Push request to real time database and wait for response
    const res = await pushAndWaitForReponse({
      firebase,
      requestPath: firebasePaths.actionRunnerRequests,
      responsePath: firebasePaths.actionRunnerResponses,
      pushObj: {
        projectId: get(params, 'projectId'),
        serviceAccountType: 'firestore',
        inputValues,
        template: pick(selectedTemplate, ['steps', 'inputs'])
      },
      afterPush: toggleActionProcessing
    })
    // TODO: Add watcher for progress
    toggleActionProcessing()
    showSuccess('Action complete!')
    return res
  } catch (err) {
    toggleActionProcessing()
    showError('Error with action request')
    console.error('Error: ', err.message || err) // eslint-disable-line no-console
  }
}
