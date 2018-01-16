import React from 'react'
import ActionRunnerForm from 'components/ActionRunnerForm'
import { shallow } from 'enzyme'

describe('(Component) ActionRunnerForm', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<ActionRunnerForm actionRunnerForm={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
