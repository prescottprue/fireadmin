import { get, pick, invoke } from 'lodash'
import { firebasePaths } from 'constants'
import { pushAndWaitForReponse } from 'utils/firebaseFunctions'

export const runAction = props => async () => {
  const {
    firebase,
    firestore,
    params,
    auth,
    selectedTemplate,
    inputValues,
    toggleActionProcessing
  } = props
  // TODO: Show error notification if required action inputs are not selected
  toggleActionProcessing()
  props.toggleTemplateEdit()
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
    const res = await pushAndWaitForReponse(
      {
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
      },
      responseSnap => {
        const responseVal = invoke(responseSnap, 'val')
        if (responseVal.progress) {
          props.setActionProgress(responseVal.progress)
        }
      },
      listenerError => {
        console.error('Error: ', listenerError.message || listenerError) // eslint-disable-line no-console
        toggleActionProcessing()
        props.showError('Error with action request')
      }
    )
    // TODO: Add watcher for progress
    toggleActionProcessing()
    props.showSuccess('Action complete!')
    return res
  } catch (err) {
    console.error('Error: ', err.message || err) // eslint-disable-line no-console
    toggleActionProcessing()
    props.showError('Error with action request')
  }
}
