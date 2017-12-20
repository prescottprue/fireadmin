import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withHandlers } from 'recompose'
import { withFirebase } from 'react-redux-firebase'
import { firebasePaths } from 'constants'
import CodeMirror from 'codemirror'
import classes from './MigrationEditor.scss'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/tern/tern.css'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/keymap/sublime'
import 'codemirror/addon/fold/xml-fold' // Needed to match JSX
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'

// Needed for Firepad to load CodeMirror
require('expose-loader?CodeMirror!codemirror') // eslint-disable-line

export const MigrationEditor = ({ migrationEditor, setupCodeMirror }) => (
  <div className={classes.container}>
    <div ref={setupCodeMirror} style={{ width: '100%' }} />
  </div>
)

MigrationEditor.propTypes = {
  migrationEditor: PropTypes.object,
  setupCodeMirror: PropTypes.func.isRequired
}

export const getCodeMirror = (el, doc) => {
  const cm = new CodeMirror(el, {
    value: doc,
    theme: 'oceanic',
    keyMap: 'sublime',
    indentUnit: 2,
    autoCloseBrackets: true,
    matchTags: { bothTags: true },
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    lineNumbers: true,
    lineWrapping: false,
    styleActiveLine: true,
    lint: false
  })

  return cm
}

const enhance = compose(
  withFirebase,
  withHandlers({
    setupCodeMirror: ({ firebase, params: { projectId } }) => el => {
      const doc = new CodeMirror.Doc('', 'jsx')
      const editor = getCodeMirror(el, doc)
      editor.setOption('theme', 'monokai')
      const Firepad = require('firepad')
      const fbRef = firebase.ref(`${firebasePaths.migrations}/${projectId}`)
      Firepad.fromCodeMirror(fbRef, editor)
      // editor.setOption('lineNumbers', false)
    }
  })
)

MigrationEditor.defaultProps = {
  name: 'codemirror'
}

export default enhance(MigrationEditor)
