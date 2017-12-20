import React from 'react'
import BackupInstanceTile from 'components/BackupInstanceTile'
import { shallow } from 'enzyme'

describe('(Component) BackupInstanceTile', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<BackupInstanceTile backupInstanceTile={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
