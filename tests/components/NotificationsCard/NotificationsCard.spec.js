import React from 'react'
import NotificationsCard from 'components/NotificationsCard'
import { shallow } from 'enzyme'

describe('(Component) NotificationsCard', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<NotificationsCard notificationsCard={{}} />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
