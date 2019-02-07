import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { get } from 'lodash'
import Layout from '../components/layout'
import PostsList from '../components/PostsList/PostsList'
import Wrapper from '../components/Wrapper/Wrapper'
import SEO from '../components/SEO/SEO'
import Hero from '../components/Hero/Hero'

function Tags(props) {
  const { pageContext, location } = props
  const pageTitle = `#${pageContext.tag}`
  const posts = get(props, 'allMarkdownRemark.edges')

  return (
    <Layout location={location} title={pageTitle}>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} />

      <Wrapper>
        <h1>Posts tagged as "{pageContext.tag}"</h1>
        <PostsList posts={posts} />
      </Wrapper>
    </Layout>
  )
}

Tags.propTypes = {
  location: PropTypes.object,
  pageContext: PropTypes.object
}

export default Tags

export const pageQuery = graphql`
  query PostsByTag($tag: String!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { eq: $tag } } }
    ) {
      edges {
        node {
          excerpt
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            tags
            language
            slug
          }
        }
      }
    }
  }
`
