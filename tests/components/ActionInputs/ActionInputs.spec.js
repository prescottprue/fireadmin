import React from 'react'
import ActionInputs from 'components/ActionInputs'
import { shallow } from 'enzyme'

describe('(Component) ActionInputs', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<ActionInputs actionInputs={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
