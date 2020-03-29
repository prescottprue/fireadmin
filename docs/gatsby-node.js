const { resolve } = require('path')
const { createFilePath } = require('gatsby-source-filesystem')

/**
 * Create pages by querying for data then filling it into templates
 * which are stored in src/templates.
 * @param {Object} createArgs
 * @param {Function} createArgs.graphql - Graphql function used for querying
 * @param {Object} createArgs.actions - Gatsby actions object
 * @param {Function} createArgs.actions.createPage - Function for creating pages
 */
exports.createPages = async function createPages({ graphql, actions }) {
  const allMarkdown = await graphql(
    `
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              frontmatter {
                title
                order
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
  const pageTemplate = resolve('./src/templates/page.js')
  const { createPage } = actions

  // generate pages
  markdownFiles
    .filter((item) => item.node.frontmatter.type === 'page')
    .forEach((page) => {
      createPage({
        path: page.node.frontmatter.slug,
        component: pageTemplate,
        context: {
          slug: page.node.frontmatter.slug
        }
      })
    })
}

/**
 * Actions to run when a new node is created. Currently just used to create
 * node field for MarkdownRemark nodes.
 * @param {Object} onCreateArgs
 * @param {Function} onCreateArgs.node - Gatsby Node that was created
 * @param {Object} onCreateArgs.actions - Gatsby actions object
 * @param {Function} onCreateArgs.actions.createNodeField - Function for creating gatsby node field
 */
exports.onCreateNode = function onCreateNode({ node, actions, getNode }) {
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
