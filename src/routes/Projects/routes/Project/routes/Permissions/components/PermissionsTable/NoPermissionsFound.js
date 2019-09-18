import React from 'react'
import Paper from '@material-ui/core/Paper'

function NoPermissionsFound() {
  return (
    <Paper styles={{ padding: '2rem' }}>
      <div className="flex-row-center">No Members found</div>
    </Paper>
  )
}

export default NoPermissionsFound
