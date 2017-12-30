import React from 'react'
import MigrationTemplateAction from 'routes/MigrationTemplate/components/MigrationTemplateAction'
import { shallow } from 'enzyme'

describe('(Route: MigrationTemplate Component) MigrationTemplateAction', () => {
  let _component

  beforeEach(() => {
    _component = shallow(
      <MigrationTemplateAction migrationTemplateAction={{}} />
    )
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
