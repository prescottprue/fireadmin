import React from 'react'
import MigrationTemplateListCard from 'components/MigrationTemplateListCard'
import { shallow } from 'enzyme'

describe('(Component) MigrationTemplateListCard', () => {
  let _component

  beforeEach(() => {
    _component = shallow(
      <MigrationTemplateListCard migrationTemplateListCard={{}} />
    )
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
