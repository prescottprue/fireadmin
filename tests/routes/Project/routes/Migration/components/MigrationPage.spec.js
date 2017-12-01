import React from 'react'
import MigrationPage from 'routes/Project/routes/Migration/components/MigrationPage'
import { shallow } from 'enzyme'

describe('(Route: Project Route: Migration Component) MigrationPage', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationPage migrationPage={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
