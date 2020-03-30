import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import PostsListItem from '../PostsListItem/PostsListItem'

function PostsList({ posts }) {
  return (
    <Fragment>
      {posts &&
        posts.map((post) => {
          const itemProps = {
            title: post.node.frontmatter.title,
            excerpt: post.node.excerpt,
            slug: post.node.frontmatter.slug,
            date: post.node.frontmatter.date,
            language: post.node.frontmatter.language || 'fr',
            tags: post.node.frontmatter.tags || []
          }
          return <PostsListItem key={itemProps.slug} {...itemProps} />
        })}
    </Fragment>
  )
}

PostsList.propTypes = {
  posts: PropTypes.array
}

export default PostsList
