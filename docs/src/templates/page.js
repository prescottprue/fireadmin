import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { get } from 'lodash'
import Typography from '@material-ui/core/Typography'
import Layout from '../components/layout'
import Content from '../components/Content/Content'
import Wrapper from '../components/Wrapper/Wrapper'
import SEO from '../components/SEO/SEO'

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
        slug
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___order], order: ASC } # sort by order
      filter: { frontmatter: { type: { ne: "post" } } } # only those without type: "post"
    ) {
      edges {
        node {
          excerpt
          frontmatter {
            title
            order
            tags
            language
            slug
          }
        }
      }
    }
  }
`
