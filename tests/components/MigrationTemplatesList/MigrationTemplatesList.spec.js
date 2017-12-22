import React from 'react'
import MigrationTemplatesList from 'components/MigrationTemplatesList'
import { shallow } from 'enzyme'

describe('(Component) MigrationTemplatesList', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationTemplatesList migrationTemplatesList={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
