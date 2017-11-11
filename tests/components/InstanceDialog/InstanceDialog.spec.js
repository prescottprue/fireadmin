import React from 'react'
import InstanceDialog from 'components/InstanceDialog'
import { shallow } from 'enzyme'

describe('(Component) InstanceDialog', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<InstanceDialog instanceDialog={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
