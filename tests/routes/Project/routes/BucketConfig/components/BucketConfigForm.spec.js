import React from 'react'
import BucketConfigForm from 'routes/project/routes/BucketConfig/components/BucketConfigForm'
import { shallow } from 'enzyme'

describe('(Component) BucketConfigForm', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<BucketConfigForm bucketConfigForm={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
