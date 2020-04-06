import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
// import { useDatabase } from 'reactfire'
// import { invoke } from 'lodash'
// import CodeMirror from 'codemirror'
// import { getCodeMirror } from './ActionEditor.utils'

// let firepadEditor

const useStyles = makeStyles((theme) => ({
  lineHeight: '22.4px',
  fontFamily: 'Roboto Mono',
  fontSize: '16px',
  height: '100%',
  marginTop: '2rem',
  width: '80vw'
}))

function ActionEditor(props) {
  const classes = useStyles()
  // const firebase = useDatabase()

  function setupEditor(el) {
    if (!props.rtdbPath) {
      throw new Error('Real Time DB path required to make editor')
    }
    // // Called when un-mounting
    // if (el === null) {
    //   // Dispose of firepad instance
    //   return invoke(firepadEditor, 'dispose')
    // }
    // const doc = new CodeMirror.Doc('', 'javascript')
    // const editor = getCodeMirror(el, doc)
    // editor.setOption('theme', 'monokai')
    // // const Firepad = require('firepad')
    // const fbRef = firebase.ref(props.rtdbPath)
    // window.firebase = firebase // needed for Firepad to access Firebase lib
    // const settings = {
    //   defaultText: `// run custom code here including promises
    //   // admin.firebase.ref('some/path').once('value').then(snap => snap.numChildren())`
    // }
    // try {
    //   firepadEditor = Firepad.fromCodeMirror(fbRef, editor, settings)
    // } catch (err) {
    //   console.error('It threw :(') // eslint-disable-line
    // }
    // editor.setOption('lineNumbers', false)
  }

  return (
    <div className={classes.container}>
      <div ref={setupEditor} style={{ width: '100%' }} />
    </div>
  )
}

ActionEditor.propTypes = {
  setupEditor: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default ActionEditor
