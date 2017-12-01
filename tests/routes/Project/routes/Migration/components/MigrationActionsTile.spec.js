import React from 'react'
import MigrationActionsTile from 'routes/Project/routes/Migration/components/MigrationActionsTile'
import { shallow } from 'enzyme'

describe('(Route: Project Route: Migration Component) MigrationActionsTile', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationActionsTile migrationActionsTile={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
