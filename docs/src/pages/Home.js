import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import Layout from '../components/layout'
import Wrapper from '../components/Wrapper/Wrapper'
import SEO from '../components/SEO/SEO'
import HomePage from '../components/HomePage'

function Home({ data, location }) {
  return (
    <Layout location={location} pages={get(data, 'allMarkdownRemark.edges')}>
      <SEO />
      <Wrapper>
        <HomePage />
      </Wrapper>
    </Layout>
  )
}

Home.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object.isRequired
}

export default Home

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
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
