import styled from 'styled-components'
import Link from 'gatsby-link'

export const StyledLink = styled(Link)`
  border-bottom: 1px dotted rgba(162, 162, 162, 0.8);

  &:hover {
    border-bottom-style: solid;
  }
`

export const Text = styled.p`
  line-height: 1.6;
  margin: 1em 0 0 0;
`
