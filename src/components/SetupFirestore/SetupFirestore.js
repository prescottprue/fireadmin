import { useFirestore } from 'reactfire'

export default function SetupFirestore() {
  const firestore = useFirestore()
  const firestoreSettings = {}
  if (window.Cypress) {
    // Needed for Firestore support in Cypress (see https://github.com/cypress-io/cypress/issues/6350)
    firestoreSettings.experimentalForceLongPolling = true
  }
  if (process.env.REACT_APP_FIRESTORE_EMULATOR_HOST) {
    firestoreSettings.host = process.env.REACT_APP_FIRESTORE_EMULATOR_HOST
    firestoreSettings.ssl = false
    // eslint-disable-next-line no-console
    console.debug(
      `Firestore emulator enabled: ${process.env.REACT_APP_FIRESTORE_EMULATOR_HOST}`
    )
  }
  firestore.settings(firestoreSettings)

  return null
}
