import React from 'react'
import BackupsCard from 'components/BackupsCard'
import { shallow } from 'enzyme'

describe('(Component) BackupsCard', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<BackupsCard backupsCard={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
