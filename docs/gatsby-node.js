const { resolve } = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPostTemplate = resolve('./src/templates/blog-post.js')
  const pageTemplate = resolve('./src/templates/page.js')
  const postsBytagTemplate = resolve('./src/templates/tags.js')

  const allMarkdown = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              frontmatter {
                title
                slug
                type
                tags
              }
            }
          }
        }
      }
    `
  )

  if (allMarkdown.errors) {
    console.error(allMarkdown.errors) // eslint-disable-line no-console
    throw Error(allMarkdown.errors)
  }

  const markdownFiles = allMarkdown.data.allMarkdownRemark.edges

  // generate blog posts
  markdownFiles
    .filter(item => item.node.frontmatter.type !== 'page')
    .forEach((post, index, posts) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node

      createPage({
        path: post.node.frontmatter.slug || `slug-${Date.now()}`,
        component: blogPostTemplate,
        context: {
          slug: post.node.frontmatter.slug || `slug-${Date.now()}`,
          previous,
          next
        }
      })
    })

  // generate pages
  markdownFiles
    .filter(item => item.node.frontmatter.type === 'page')
    .forEach(page => {
      createPage({
        path: page.node.frontmatter.slug,
        component: pageTemplate,
        context: {
          slug: page.node.frontmatter.slug
        }
      })
    })

  // generate tags
  markdownFiles
    .filter(item => item.node.frontmatter.tags !== null)
    .reduce(
      (acc, cur) => [...new Set([...acc, ...cur.node.frontmatter.tags])],
      []
    )
    .forEach(uniqTag => {
      createPage({
        path: `tags/${uniqTag}`,
        component: postsBytagTemplate,
        context: {
          tag: uniqTag
        }
      })
    })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value
    })
  }
}
