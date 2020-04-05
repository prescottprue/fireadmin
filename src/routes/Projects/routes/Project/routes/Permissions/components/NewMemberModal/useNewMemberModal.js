import { useState } from 'react'
import { get, findIndex } from 'lodash'
import useNotifications from 'modules/notification/useNotifications'
import { useFirestore, useFirestoreDocData } from 'reactfire'

export default function useNewMemberModal({ projectId, onRequestClose, open }) {
  const { showError, showSuccess } = useNotifications()

  // State Management
  const [selectedCollaborators, changeSelectedCollaborators] = useState([])
  const [suggestions, changeSuggestions] = useState([])
  const [inputValue, changeInputValue] = useState([])
  const setSuggestions = (suggestions) =>
    changeSelectedCollaborators(suggestions)
  const clearSuggestions = () => changeSelectedCollaborators([])
  const selectCollaborator = (newCollaborator) => {
    const currentIndex = findIndex(selectedCollaborators, {
      objectID: newCollaborator.id || newCollaborator.objectID
    })
    const newSelected = [...selectedCollaborators]

    if (currentIndex === -1) {
      newSelected.push(newCollaborator)
    } else {
      newSelected.splice(currentIndex, 1)
    }
    changeSelectedCollaborators(newSelected)
  }
  const reset = () => {
    changeSelectedCollaborators([])
    changeSuggestions([])
    changeInputValue('')
  }
  const closeAndReset = () => {
    reset()
    onRequestClose()
  }
  const handleChange = (e) => {
    changeInputValue(e.target.value)
  }

  // Data loading
  const firestore = useFirestore()
  const { FieldValue } = useFirestore
  const projectRef = firestore.doc(`projects/${projectId}`)
  const project = useFirestoreDocData(projectRef)

  async function updateCollaborators() {
    // Get existing collaborators and permissions
    const collaborators = get(project, 'collaborators', {})
    const permissions = get(project, 'permissions', {})
    // Add new collaborators from selectCollaborator prop
    selectedCollaborators.forEach((currentCollaborator) => {
      // Only add new collaborators which do not already exist
      if (!get(project, `collaborators.${currentCollaborator.objectID}`)) {
        collaborators[currentCollaborator.objectID] = true
        permissions[currentCollaborator.objectID] = {
          permission: 'viewer',
          sharedAt: FieldValue.serverTimestamp()
        }
      }
    })
    try {
      await firestore
        .doc(`projects/${projectId}`)
        .update({ collaborators, permissions })
      onRequestClose()
      showSuccess('Collaborator added successfully')
    } catch (err) {
      showError('Collaborator could not be added')
      throw err
    }
  }

  return {
    suggestions,
    project,
    inputValue,
    setSuggestions,
    clearSuggestions,
    selectedCollaborators,
    selectCollaborator,
    handleChange,
    closeAndReset,
    updateCollaborators
  }
}
