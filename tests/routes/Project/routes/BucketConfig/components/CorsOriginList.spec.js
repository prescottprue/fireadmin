import React from 'react'
import CorsOriginList from 'routes/project/routes/BucketConfig/components/CorsOriginList'
import { shallow } from 'enzyme'

describe('(Component) CorsOriginList', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<CorsOriginList corsOriginList={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
