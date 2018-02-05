import React from 'react'
import ActionTemplateBackups from 'components/ActionTemplateBackups'
import { shallow } from 'enzyme'

describe('(Component) ActionTemplateBackups', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<ActionTemplateBackups actionTemplateBackups={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
