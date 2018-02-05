import React from 'react'
import { ProjectEvents } from 'routes/ProjectEvents/components/ProjectEvents/ProjectEvents'
import { shallow } from 'enzyme'

describe('(ProjectEvents Component) AccountForm', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<ProjectEvents />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
