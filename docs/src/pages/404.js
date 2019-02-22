import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Layout from '../components/layout'
import Wrapper from '../components/Wrapper/Wrapper'
import SEO from '../components/SEO/SEO'
import { Text } from '../components/Commons'

const MainTitle = styled.h1`
  line-height: 1.5;
  text-align: center;
  font-size: 3rem;
`

const Ghost = styled.span`
  line-height: 1.5;
  text-align: center;
  font-size: 7rem;
`

function NotFoundPage({ data, location }) {
  return (
    <Layout location={location} noCover>
      <SEO title="Page Not Found" />
      <Wrapper>
        <MainTitle>404 Page Not Found</MainTitle>
        <Ghost>
          <span role="img" aria-label="Calendar">
            👻
          </span>
        </Ghost>
        <Text>
          Looks like you've followed a broken link or entered a URL that doesn't
          exist on this site.
        </Text>
      </Wrapper>
    </Layout>
  )
}

NotFoundPage.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object
}

export default NotFoundPage
