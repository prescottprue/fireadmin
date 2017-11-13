import React from 'react'
import MigrationInstanceTile from 'components/MigrationInstanceTile'
import { shallow } from 'enzyme'

describe('(Component) MigrationInstanceTile', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationInstanceTile migrationInstanceTile={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
