import React from 'react'
import { MigrationTemplates } from 'routes/MigrationTemplates/components/MigrationTemplates/MigrationTemplates'
import { shallow } from 'enzyme'

describe('(MigrationTemplates Component) AccountForm', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationTemplates />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
