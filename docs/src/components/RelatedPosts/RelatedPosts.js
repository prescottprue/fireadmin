import React from 'react'
import PropTypes from 'prop-types'
import { StyledLink } from '../Commons'

function RelatedPosts({ posts }) {
  return (
    <ul>
      {posts.map((post) => {
        const title = post.node.frontmatter.title
        const slug = post.node.frontmatter.slug
        return (
          <li key={slug}>
            <StyledLink to={slug}>{title}</StyledLink>
          </li>
        )
      })}
    </ul>
  )
}

RelatedPosts.propTypes = {
  posts: PropTypes.array
}

export default RelatedPosts
