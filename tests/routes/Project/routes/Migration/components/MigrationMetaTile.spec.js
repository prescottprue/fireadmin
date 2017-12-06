import React from 'react'
import MigrationMetaTile from 'routes/Project/routes/Migration/components/MigrationMetaTile'
import { shallow } from 'enzyme'

describe('(Route: Project Route: Migration Component) MigrationMetaTile', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationMetaTile migrationMetaTile={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
