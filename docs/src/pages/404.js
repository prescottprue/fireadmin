import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { graphql } from 'gatsby'
import { get } from 'lodash'
import Layout from '../components/layout'
import Wrapper from '../components/Wrapper/Wrapper'
import SEO from '../components/SEO/SEO'
import RelatedPosts from '../components/RelatedPosts/RelatedPosts'
import { Text } from '../components/Commons'

const MainTitle = styled.h1`
  line-height: 1.5;
  text-align: center;
  font-size: 3rem;
`

const Ghost = styled.span`
  line-height: 1.5;
  text-align: center;
  font-size: 7rem;
`

const SubTitle = styled.h2`
  padding-top: 40px;
  line-height: 1.2;
  border-top: 1px solid #ececec;
  margin-top: 44px;
`

function NotFoundPage({ data, location }) {
  return (
    <Layout location={location} noCover>
      <SEO title="Page Not Found" />
      <Wrapper>
        <MainTitle>404 Page Not Found</MainTitle>
        <Ghost>
          <span role="img" aria-label="Calendar">
            👻
          </span>
        </Ghost>
        <Text>
          Looks like you've followed a broken link or entered a URL that doesn't
          exist on this site.
        </Text>

        <SubTitle>Recent Posts</SubTitle>

        <RelatedPosts posts={get(data, 'allMarkdownRemark.edges')} />
      </Wrapper>
    </Layout>
  )
}

NotFoundPage.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object
}

export default NotFoundPage

export const pageQuery = graphql`
  query {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { type: { ne: "page" } } }
      limit: 5
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
