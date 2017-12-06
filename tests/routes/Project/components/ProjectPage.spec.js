import React from 'react'
import ProjectPage from 'routes/Project/components/ProjectPage'
import { shallow } from 'enzyme'

describe.skip('(Route: Project Component) ProjectPage', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<ProjectPage projectPage={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
