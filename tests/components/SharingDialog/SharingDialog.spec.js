import React from 'react'
import SharingDialog from 'components/SharingDialog'
import { shallow } from 'enzyme'

describe('(Component) SharingDialog', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<SharingDialog sharingDialog={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
