import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import './Footer.css'

function FooterItem({ item }) {
  if (typeof item === 'string') {
    return (
      <h5 className="footer-title" key={item}>
        {item}
      </h5>
    )
  }
  if (item.url.startsWith('/')) {
    return (
      <span className="footer-item">
        <Link className="footer-link" to={item.url}>
          {item.label}
        </Link>
      </span>
    )
  }
  return (
    <span className="footer-item">
      <a className="footer-link" href={item.url}>
        {item.label}
      </a>
    </span>
  )
}

FooterItem.propTypes = {
  item: PropTypes.shape({
    url: PropTypes.string
  })
}

export default FooterItem
