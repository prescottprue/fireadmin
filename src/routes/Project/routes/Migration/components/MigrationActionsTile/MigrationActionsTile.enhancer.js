import { compose } from 'redux'
import { withStateHandlers } from 'recompose'

export default compose(
  withStateHandlers(
    ({ initialActions = [] }) => ({
      selectedActions: initialActions,
      newDialogOpen: false,
      drawerOpen: false
    }),
    {
      addAction: ({ selectedActions }) => action => ({
        selectedActions: selectedActions.concat(action)
      }),
      removeAction: ({ selectedActions }) => ind => ({
        selectedActions: selectedActions.filter((_, i) => i !== ind)
      })
    }
  )
)
