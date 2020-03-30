import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Layout from '../components/layout'
import Wrapper from '../components/Wrapper/Wrapper'
import SEO from '../components/SEO/SEO'

const useStyles = makeStyles((theme) => ({
  main: {
    textAlign: 'center'
  },
  ghost: {
    lintHeight: 1.5,
    textAlign: 'center',
    fontSize: '7rem'
  }
}))

function NotFoundPage({ data, location }) {
  const classes = useStyles()
  return (
    <Layout location={location} noCover>
      <SEO title="Page Not Found" />
      <Wrapper>
        <Typography variant="h3" gutterBottom className={classes.main}>
          404 Page Not Found
        </Typography>
        <span role="img" aria-label="Calendar" className={classes.ghost}>
          👻
        </span>
        <Typography variant="body1" gutterBottom>
          Looks like you've followed a broken link or entered a URL that doesn't
          exist on this site.
        </Typography>
      </Wrapper>
    </Layout>
  )
}

NotFoundPage.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object
}

export default NotFoundPage
