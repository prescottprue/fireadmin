import { graphql } from 'gatsby'
import Home from './Home'

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
