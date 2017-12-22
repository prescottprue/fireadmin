import React from 'react'
import { MigrationTemplate } from 'routes/MigrationTemplate/components/MigrationTemplate/MigrationTemplate'
import { shallow } from 'enzyme'

describe('(MigrationTemplate Component) AccountForm', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationTemplate />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
