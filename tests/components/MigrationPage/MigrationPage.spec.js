import React from 'react'
import MigrationPage from 'components/MigrationPage'
import { shallow } from 'enzyme'

describe('(Component) MigrationPage', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationPage migrationPage={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
