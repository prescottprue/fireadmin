import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import RelatedPosts from '../RelatedPosts/RelatedPosts'
import { Text } from '../Commons'

function PrevNextPost({ previous, next }) {
  const articles = [previous, next].filter(i => i).map(item => ({ node: item }))

  return (
    <Fragment>
      <Text>Read next:</Text>
      <RelatedPosts posts={articles} />
    </Fragment>
  )
}

PrevNextPost.propTypes = {
  previous: PropTypes.func,
  next: PropTypes.func
}

export default PrevNextPost
