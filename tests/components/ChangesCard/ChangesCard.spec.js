import React from 'react'
import ChangesCard from 'components/ChangesCard'
import { shallow } from 'enzyme'

describe('(Component) ChangesCard', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<ChangesCard changesCard={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
