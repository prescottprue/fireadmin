import React from 'react'
import EventsTable from 'components/EventsTable'
import { shallow } from 'enzyme'

describe('(Component) EventsTable', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<EventsTable eventsTable={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
