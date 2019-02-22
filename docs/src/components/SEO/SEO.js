import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import { withPrefix } from 'gatsby'
import siteConfig from '../../../data/siteConfig'

function SEO(props) {
  const { isBlogPost, path = '', lang = 'en' } = props
  const title = props.title
    ? `${props.title} | ${siteConfig.siteTitle}`
    : siteConfig.siteTitle
  const imagePath = props.cover || withPrefix(siteConfig.siteCover)
  const formatedSiteUrl = siteConfig.siteUrl.substring(
    0,
    siteConfig.siteUrl.length - 1
  )
  const image = `${formatedSiteUrl}${imagePath}`
  const description = props.description || siteConfig.siteDescription

  return (
    <Helmet title={title}>
      {/* General tags */}
      <html lang={lang} />
      <meta name="description" content={description} />

      {/* OpenGraph tags */}
      <meta property="og:url" content={formatedSiteUrl + withPrefix(path)} />
      <meta property="og:type" content={isBlogPost ? 'article' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={siteConfig.twitterUsername} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}

SEO.propTypes = {
  isBlogPost: PropTypes.bool,
  path: PropTypes.string,
  description: PropTypes.string,
  title: PropTypes.string,
  cover: PropTypes.string,
  lang: PropTypes.string
}

export default SEO
