import React from 'react'
import UsersSearch from 'components/UsersSearch'
import { shallow } from 'enzyme'

describe('(Component) UsersSearch', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<UsersSearch usersSearch={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
