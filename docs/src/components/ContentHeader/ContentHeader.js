import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import TagList from '../TagList/TagList'
import './ContentHeader.css'

function ContentHeader({ date, tags }) {
  return (
    <header className="ContentHeader">
      {date && <time className="ContentHeader-time">{date}</time>}
      {Array.isArray(tags) && tags.length > 0 && (
        <Fragment>
          <span className="ContentHeader-in"> in</span>
          <TagList tags={tags} />
        </Fragment>
      )}
    </header>
  )
}

ContentHeader.propTypes = {
  date: PropTypes.object,
  tags: PropTypes.array
}

export default ContentHeader
