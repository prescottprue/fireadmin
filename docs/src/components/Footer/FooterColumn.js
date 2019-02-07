import React from 'react'
import PropTypes from 'prop-types'
import FooterItem from './FooterItem'
import './Footer.css'

function FooterColumn({ column }) {
  return (
    <div className="footer-col">
      {column.map((item, i) => {
        return <FooterItem item={item} key={`footer-column-item-${i}`} />
      })}
    </div>
  )
}

FooterColumn.propTypes = {
  column: PropTypes.array
}

export default FooterColumn
