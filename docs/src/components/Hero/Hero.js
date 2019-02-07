import React from 'react'
import PropTypes from 'prop-types'
import { withPrefix } from 'gatsby'
import siteConfig from '../../../data/siteConfig'
import './Hero.css'

function Hero({ heroImg, title }) {
  const imgUrl = heroImg || withPrefix(siteConfig.siteCover)

  return (
    <div style={{ backgroundImage: `url("${imgUrl}")` }} className="hero">
      <div className="hero-title">
        <h1>{title}</h1>
      </div>
    </div>
  )
}

Hero.propTypes = {
  heroImg: PropTypes.string,
  title: PropTypes.string
}

export default Hero
