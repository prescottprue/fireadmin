import React from 'react'
import MigrationMetaTile from 'components/MigrationMetaTile'
import { shallow } from 'enzyme'

describe('(Component) MigrationMetaTile', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<MigrationMetaTile migrationMetaTile={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
