import React from 'react';
import { Environments } from 'routes/Environments/components/Environments/Environments';
import { shallow } from 'enzyme';

describe('(Environments Component) AccountForm', () => {
  let _component;

  beforeEach(() => {
    _component = shallow(<Environments />)
  })

  it('Renders div', () => {
    const firstDiv = _component.find('div');
    expect(firstDiv).to.exist
  })

})
