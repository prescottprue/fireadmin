import React from 'react'
import AddEnvironmentDialog from 'components/AddEnvironmentDialog'
import { shallow } from 'enzyme'

describe('(Component) AddEnvironmentDialog', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<AddEnvironmentDialog addEnvironmentDialog={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
