import React from 'react'
import ProjectsPage from 'components/ProjectsPage'
import { shallow } from 'enzyme'

describe('(Component) ProjectsPage', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<ProjectsPage projectsPage={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
