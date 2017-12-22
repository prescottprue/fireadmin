import React from 'react'
import MigrationTemplateForm from 'components/MigrationTemplateForm'
import { shallow } from 'enzyme'

describe('(Component) MigrationTemplateForm', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationTemplateForm migrationTemplateForm={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
