import React from 'react'
import NewMigrationTemplateDialog from 'components/NewMigrationTemplateDialog'
import { shallow } from 'enzyme'

describe('(Component) NewMigrationTemplateDialog', () => {
  let _component

  beforeEach(() => {
    _component = shallow(
      <NewMigrationTemplateDialog newMigrationTemplateDialog={{}} />
    )
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
