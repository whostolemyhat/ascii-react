import React from 'react';
import Progress from 'components/Progress/Progress';
import { shallow } from 'enzyme';

describe('(Component) Progress', () => {
  let _wrapper, _props;

  beforeEach(() => {
    _props = {
      percentComplete: 0
    };

    _wrapper = shallow(<Progress { ..._props } />);
  });

  it('Renders a progress bar', () => {
    expect(_wrapper.find('progress')).to.exist;
  });

  it('Updates progress', () => {
    expect(_wrapper.find('progress').props().value).to.equal(0);

    _props = {
      percentComplete: 24
    };
    _wrapper = shallow(<Progress { ..._props } />);

    expect(_wrapper.find('progress').props().value).to.equal(24);
  });
});
