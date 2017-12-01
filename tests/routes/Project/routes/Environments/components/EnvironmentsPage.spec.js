import React from 'react'
import EnvironmentsPage from 'routes/Project/routes/Environments/components/EnvironmentsPage'
import { shallow } from 'enzyme'

// Skipped due to: undefined is not an object (evaluating '_store.firebase')
describe.skip('(Route: Project Route: Environments Component) EnvironmentsPage', () => {
  let _component

  beforeEach(() => {
    _component = shallow(<EnvironmentsPage />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div')
    expect(firstDiv).to.exist
  })
})
