import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import TagList from '../TagList/TagList'
import './PostsListItem.css'

function PostsListItem({ title, excerpt, slug, date, language, tags }) {
  return (
    <article className="post">
      <header className="post-header">
        <h2 className="post-title">
          <Link to={slug}>{title}</Link>
        </h2>
      </header>
      <section className="post-excerpt">
        <p dangerouslySetInnerHTML={{ __html: excerpt }} />
      </section>
      <footer className="post-meta">
        <TagList tags={tags} icon />
        <span role="img" aria-label="Calendar">
          🗓{' '}
        </span>
        <time className="post-date">{date}</time>
        <Link className="post-read" to={slug}>
          Read post ›
        </Link>
      </footer>
    </article>
  )
}

PostsListItem.propTypes = {
  title: PropTypes.string,
  excerpt: PropTypes.string,
  slug: PropTypes.string,
  date: PropTypes.string,
  language: PropTypes.string,
  tags: PropTypes.array
}

export default PostsListItem
