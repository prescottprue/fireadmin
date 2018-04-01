import React from 'react'
import TabContainer from 'components/TabContainer'
import { shallow } from 'enzyme'

describe('(Component) TabContainer', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<TabContainer tabContainer={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
