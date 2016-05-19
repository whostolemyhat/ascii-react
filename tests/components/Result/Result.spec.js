import React from 'react';
import Result from 'components/Result/Result';
import { shallow } from 'enzyme';

describe('(Component) Result', () => {
  let _wrapper, _props;

  beforeEach(() => {
    _props = {
      output: ''
    };

    _wrapper = shallow(<Result { ..._props } />);
  });

  it('Renders', () => {
    expect(_wrapper.find('.result')).to.exist;
  });

  it('Shows text', () => {
    _props = {
      output: 'test'
    };
    _wrapper = shallow(<Result { ..._props } />);

    expect(_wrapper.find('.result').text()).to.match(/test/);
  });
});
