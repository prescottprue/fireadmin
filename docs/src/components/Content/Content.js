import React from 'react'
import PropTypes from 'prop-types'
import ContentHeader from '../ContentHeader/ContentHeader'
import './Content.css'
import './GatsbyHighlight.css'

function Content({ content, date, tags }) {
  return (
    <section>
      {(tags || date) && <ContentHeader date={date} tags={tags} />}
      <div className="content" dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  )
}

Content.propTypes = {
  content: PropTypes.string,
  date: PropTypes.object,
  tags: PropTypes.array
}

export default Content
