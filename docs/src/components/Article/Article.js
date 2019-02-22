import React from 'react'
import PropTypes from 'prop-types'
import Bio from '../Bio/Bio'
import Content from '../Content/Content'
import './Article.css'

function Article({ post }) {
  return (
    <article className="article">
      <Content
        content={post.html}
        date={post.frontmatter.date}
        tags={post.frontmatter.tags}
      />
      <footer className="article-footer">
        <Bio />
      </footer>
    </article>
  )
}

Article.propTypes = {
  post: PropTypes.object
}

export default Article
