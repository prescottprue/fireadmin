import React from 'react'
import ProjectTile from 'routes/Projects/components/ProjectTile'
import { shallow } from 'enzyme'

// skipped due to: undefined is not an object (evaluating '_store.firebase')
describe.skip('(Route: Projects Component) ProjectTile', () => {
  let _component

  beforeEach(() => {
    _component = shallow(
      <ProjectTile
        project={{ createdBy: { displayName: 'user' }, name: 'test' }}
        onSelect={() => console.log('project tile clicked')} // eslint-disable-line no-console
      />
    )
  })

  it('Renders', () => {
    const wrapper = _component.find('div')
    expect(wrapper).to.exist
  })

  it('Renders description', () => {
    const welcome = _component.find('h2')
    expect(welcome).to.exist
  })
})
