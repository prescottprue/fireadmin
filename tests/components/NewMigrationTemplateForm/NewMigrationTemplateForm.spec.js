import React from 'react'
import NewMigrationTemplateForm from 'components/NewMigrationTemplateForm'
import { shallow } from 'enzyme'

describe('(Component) NewMigrationTemplateForm', () => {
  let _component

  beforeEach(() => {
    _component = shallow(
      <NewMigrationTemplateForm newMigrationTemplateForm={{}} />
    )
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
