import React from 'react'
import MigrationTile from 'routes/Project/routes/Migration/components/MigrationTile'
import { shallow } from 'enzyme'

describe.skip('(Route: Project Route: Migration Component) MigrationTile', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationTile migrationTile={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
