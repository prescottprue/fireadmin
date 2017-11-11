import React from 'react'
import MigrationActionsTile from 'components/MigrationActionsTile'
import { shallow } from 'enzyme'

describe('(Component) MigrationActionsTile', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationActionsTile migrationActionsTile={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
