import React from 'react'
import { useMessaging, useUser } from 'reactfire'
import useSetupMessaging from './useSetupMessaging'

function LoadMessaging() {
  const { initializeMessaging } = useSetupMessaging()
  initializeMessaging()
  return null
}

function LoadIfAuthed() {
  const user = useUser()

  // Render nothing if user is not logged in or if messaging is not supported
  if (!user || !user.uid) {
    return null
  }

  return <LoadMessaging />
}

export default function SetupMessaging() {
  const { isSupported } = useMessaging

  // Render nothing if not supported or run UI tests
  if (!isSupported() || window.Cypress) {
    return null
  }

  // Load messaging if user is logged in
  return <LoadIfAuthed />
}
