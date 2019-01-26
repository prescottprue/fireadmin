import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import './TagList.css'

function TagList({ tags, icon }) {
  return (
    <div className="tag-list">
      {icon === true && <Fragment>🏷 </Fragment>}
      {tags.map((tag, i) => {
        return (
          <Fragment key={`tag-list-${i}`}>
            <Link className="tag-list-item" to={`tags/${tag}`}>
              {tag}
            </Link>
            {i < tags.length - 1 ? ', ' : ''}
          </Fragment>
        )
      })}
    </div>
  )
}

TagList.propTypes = {
  tags: PropTypes.array,
  icon: PropTypes.bool
}

export default TagList
