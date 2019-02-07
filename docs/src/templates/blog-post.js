import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { get } from 'lodash'
import Layout from '../components/layout'
import Wrapper from '../components/Wrapper/Wrapper'
import Hero from '../components/Hero/Hero'
import Article from '../components/Article/Article'
import PrevNextPost from '../components/PrevNextPost/PrevNextPost'
import SEO from '../components/SEO/SEO'

function BlogPostTemplate(props) {
  const post = props.data.markdownRemark
  const { previous, next } = props.pageContext
  const pages = get(props, 'data.allMarkdownRemark.edges')

  return (
    <Layout location={props.location} pages={pages}>
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        cover={post.frontmatter.cover && post.frontmatter.cover.publicURL}
        lang={post.frontmatter.language}
        path={post.frontmatter.slug}
        isBlogPost
      />

      <Hero
        heroImg={post.frontmatter.cover && post.frontmatter.cover.publicURL}
        title={post.frontmatter.title}
      />

      <Wrapper>
        <Article post={post} />
      </Wrapper>

      <Wrapper>
        <PrevNextPost previous={previous} next={next} />
      </Wrapper>
    </Layout>
  )
}

BlogPostTemplate.propTypes = {
  location: PropTypes.object,
  pageContext: PropTypes.object,
  data: PropTypes.object
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        slug
        language
        tags
        cover {
          publicURL
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { type: { ne: "post" } } }
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
