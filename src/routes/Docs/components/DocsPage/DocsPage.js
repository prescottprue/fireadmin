import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Markdown from 'react-markdown'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Prism from 'prismjs'
import LoadingSpinner from 'components/LoadingSpinner'
import SideBar from '../DocsSideBar'

function highlight(str, lang) {
  try {
    return Prism.highlight(str, Prism.languages[lang], lang)
  } catch (err) {}

  return '' // use external default escaping
}

async function loadContent() {
  const content = await require(`docs/index.md`)
  return content
}

function DocsPage({ docs, classes }) {
  const [markdownContent, setContent] = useState(false)
  loadContent().then(content => {
    setContent(content)
  })
  if (!markdownContent) {
    return <LoadingSpinner />
  }

  const renderers = {
    heading: props => {
      return <Typography variant={`h${props.level}`} {...props} />
    },
    paragraph: props => {
      return <Typography variant="body2" {...props} />
    },
    link: Link
  }
  return (
    <div className={classes.container}>
      <SideBar />
      <Markdown options={{ highlight }} renderers={renderers}>
        {markdownContent}
      </Markdown>
    </div>
  )
}

DocsPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  docs: PropTypes.object // from enhancer (firestoreConnect + connect)
}

export default DocsPage
