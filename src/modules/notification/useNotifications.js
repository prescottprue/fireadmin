import { NotificationsContext } from './NotificationsProvider'
import { useContext } from 'react'

export default function useNotifications() {
  return useContext(NotificationsContext)
}
