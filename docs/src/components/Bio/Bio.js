import React, { Fragment } from 'react'
import { withPrefix } from 'gatsby'
import siteConfig from '../../../data/siteConfig'
import './Bio.css'

function Bio() {
  const prefixedImg = withPrefix(siteConfig.authorAvatar)
  return (
    <Fragment>
      <figure className="author-image">
        <a
          href={siteConfig.authorAvatar}
          src={siteConfig.authorAvatar}
          alt={siteConfig.authorName}>
          <span
            style={{ backgroundImage: `url("${prefixedImg}")` }}
            className="img"
          />
        </a>
      </figure>
      <section>
        <h4>About the author</h4>
        <p
          className="bio-text"
          dangerouslySetInnerHTML={{ __html: siteConfig.authorDescription }}
        />
      </section>
    </Fragment>
  )
}

export default Bio
