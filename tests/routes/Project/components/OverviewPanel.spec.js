import React from 'react'
import OverviewPanel from 'routes/Project/components/OverviewPanel'
import { shallow } from 'enzyme'

describe('(Route: Project Component) OverviewPanel', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<OverviewPanel project={{}} params={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
