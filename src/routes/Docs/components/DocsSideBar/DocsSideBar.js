import React from 'react'
import PropTypes from 'prop-types'
import List from '@material-ui/core/List'
import DocsSideBarItem from '../DocsSideBar'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import loadFiles from 'utils/loadFiles'

function DocsSideBar({ docsSideBar, classes }) {
  // const filesList = loadFiles()
  const filesList = [{ attributes: { title: 'test' } }]
  console.log('docs side bar:', filesList)
  return (
    <List component="nav" className={classes.root}>
      {filesList.map(({ attributes: { title } }, i) => {
        return <DocsSideBarItem key={`${title}-i`} title={title} />
      })}
    </List>
  )
}

DocsSideBar.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  docsSideBar: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default DocsSideBar
