import React from 'react'
import MigrationTemplateInputs from 'components/MigrationTemplateInputs'
import { shallow } from 'enzyme'

describe('(Component) MigrationTemplateInputs', () => {
  let _component

  beforeEach(() => {
    _component = shallow(
      <MigrationTemplateInputs migrationTemplateInputs={{}} />
    )
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
