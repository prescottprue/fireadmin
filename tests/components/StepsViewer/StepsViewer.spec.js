import React from 'react'
import StepsViewer from 'components/StepsViewer'
import { shallow } from 'enzyme'

describe('(Component) StepsViewer', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<StepsViewer stepsViewer={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
