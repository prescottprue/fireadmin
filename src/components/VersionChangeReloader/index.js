import { useEffect } from 'react'
import { useDatabase, useDatabaseObjectData } from 'reactfire'

export default function VersionChangeReloader() {
  const database = useDatabase()
  const versionInfo = useDatabaseObjectData(database.ref('versionInfo'))
  const sessionStorageKey = 'fireadminVersion'
  const sessionVersion = window.sessionStorage.getItem(sessionStorageKey)

  useEffect(() => {
    const currentRemoteVersion = versionInfo.current
    const currentClientVersion = window.version

    // set version to session storage if it does not exist
    if (!sessionVersion) {
      window.sessionStorage.setItem(sessionStorageKey, currentRemoteVersion)
      // Exit since the client does not have a version in session storage
      return
    }

    // Exit if there is no current remote version
    if (!currentRemoteVersion) {
      return
    }

    // Check if version in Database matches client's session version
    const versionDiscrepencyExists =
      currentRemoteVersion !== currentClientVersion

    // Previous refresh or version set to state has happened
    const refreshHasOccurred = currentRemoteVersion === sessionVersion

    // Refresh if session contains different version than database
    if (versionDiscrepencyExists && !refreshHasOccurred) {
      window.location.reload(true)
    }
  }, [versionInfo, sessionVersion])

  return null
}
