import { filter, get } from 'lodash'
import { withPrefix } from 'gatsby'

/**
 * Get a list of pages which represent child chapters
 * i.e. they are not at the top level.
 * @param {Array} pages - List of pages
 */
export function getChildChapters(pages) {
  return filter(pages, (page) => {
    const slug = get(page, 'node.frontmatter.slug') || ''
    return slug.split('/').length > 1
  })
}

/**
 * Check current location for a match with a slug from
 * frontmatter.
 * @param {String} slug - Slug value to check for in path
 */
export function slugIsInCurrentPath(slug) {
  /* eslint-disable no-restricted-globals */
  return (
    typeof location !== 'undefined' &&
    location.pathname.includes(withPrefix(slug))
  )
  /* eslint-enable no-restricted-globals */
}
