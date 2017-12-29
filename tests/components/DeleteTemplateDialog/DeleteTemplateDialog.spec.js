import React from 'react'
import DeleteTemplateDialog from 'components/DeleteTemplateDialog'
import { shallow } from 'enzyme'

describe('(Component) DeleteTemplateDialog', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<DeleteTemplateDialog deleteTemplateDialog={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
