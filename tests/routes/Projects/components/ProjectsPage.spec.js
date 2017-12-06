import React from 'react'
import ProjectsPage from 'routes/Projects/components/ProjectsPage'
import { shallow } from 'enzyme'

// Skipped due to: undefined is not an object (evaluating '_store.firebase')
describe.skip('(Route: Projects Component) ProjectsPage', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<ProjectsPage projects={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
