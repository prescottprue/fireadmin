import React from 'react'
import ProjectPage from 'components/ProjectPage'
import { shallow } from 'enzyme'

describe('(Component) ProjectPage', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<ProjectPage projectPage={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
