import React from 'react'
import PropTypes from 'prop-types'
import FooterColumn from './FooterColumn'
import './Footer.css'

function Footer({ siteConfig }) {
  const { authorName, footerLinks } = siteConfig
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <div className="footer-col">
          <h5 className="footer-title">{authorName} © 2018</h5>
          <p className="footer-item-text">
            Built with{' '}
            <a className="footer-link" href="https://www.gatsbyjs.org">
              Gatsby
            </a>
            .
          </p>
        </div>
        {footerLinks.map((column, i) => (
          <FooterColumn column={column} key={`footer-column-${i}`} />
        ))}
      </nav>
    </footer>
  )
}

Footer.propTypes = {
  siteConfig: PropTypes.object
}

export default Footer
