import React from 'react'
import MigrationEditor from 'components/MigrationEditor'
import { shallow } from 'enzyme'

describe('(Component) MigrationEditor', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationEditor migrationEditor={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
