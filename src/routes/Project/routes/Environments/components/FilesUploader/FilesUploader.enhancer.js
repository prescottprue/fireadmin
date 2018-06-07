import { compose } from 'redux'
import { withStateHandlers, setDisplayName } from 'recompose'

export default compose(
  withStateHandlers(
    () => ({
      droppedFiles: [],
      selectedFiles: []
    }),
    {
      toggleDialogWithData: ({ envDialogOpen }) => (action, key) => ({
        envDialogOpen: !envDialogOpen,
        selectedInstance: action,
        selectedKey: key
      }),
      toggleDialog: ({ envDialogOpen }) => () => ({
        envDialogOpen: !envDialogOpen,
        selectedInstance: null,
        selectedKey: null
      }),
      selectFile: ({ selectedFiles }) => newlySelectedFiles => ({
        selectedServiceAccount: selectedFiles.concat(newlySelectedFiles)
      }),
      dropFiles: ({ droppedFiles }) => files => ({
        droppedFiles: droppedFiles.concat(files)
      })
    }
  ),
  setDisplayName('FilesUploader')
)
