import React from 'react'
import ActionInput from 'components/ActionInput'
import { shallow } from 'enzyme'

describe('(Component) ActionInput', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<ActionInput actionInput={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
