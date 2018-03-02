import React from 'react'
import RecentActions from 'routes/Project/routes/Actions/components/RecentActions'
import { shallow } from 'enzyme'

describe('(Route:Project Route:Actions Component) RecentActions', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<RecentActions recentActions={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
