import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { get } from 'lodash'
import Layout from '../components/layout'
import Content from '../components/Content/Content'
import Wrapper from '../components/Wrapper/Wrapper'
import Hero from '../components/Hero/Hero'
import SEO from '../components/SEO/SEO'
import { Typography } from '@material-ui/core'

function Page({ location, data, ...rest }) {
  const page = get(data, 'markdownRemark')
  return (
    <Layout location={location} pages={get(data, 'allMarkdownRemark.edges')}>
      <SEO
        title={page.frontmatter.title}
        description={page.excerpt}
        path={page.frontmatter.slug}
        cover={page.frontmatter.cover && page.frontmatter.cover.publicURL}
      />
      {page.frontmatter.cover ? (
        <Hero
          heroImg={page.frontmatter.cover && page.frontmatter.cover.publicURL}
          title={page.frontmatter.title}
        />
      ) : null}
      <Typography
        variant="h4"
        color="inherit"
        noWrap
        style={{ marginLeft: '2rem' }}>
        {page.frontmatter.title}
      </Typography>
      <Wrapper>
        <article className="page">
          <Content content={page.html} date={page.frontmatter.date} />
        </article>
      </Wrapper>
    </Layout>
  )
}

Page.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object
}

export default Page

export const pageQuery = graphql`
  query PageBySlug($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      id
      excerpt
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        slug
        cover {
          publicURL
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___title], order: ASC } # alphabetical sort
      filter: { frontmatter: { type: { ne: "post" } } } # only those without type: "post"
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
