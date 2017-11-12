import React from 'react'
import EmptyMessage from 'components/EmptyMessage'
import { shallow } from 'enzyme'

describe('(Component) EmptyMessage', () => {
  let _component

  beforeEach(() => {
    _component = shallow(
      <EmptyMessage
        emptyMessage={{}}
      />
    )
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })

})
