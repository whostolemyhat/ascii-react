import React from 'react';
import { HomeView } from 'views/Home/HomeView';
import { render } from 'enzyme';

describe('(View) Home', () => {
  let _component;

  beforeEach(() => {
    _component = render(<HomeView />);
  });

  it('Renders a welcome message', () => {
    const welcome = _component.find('h4');
    expect(welcome).to.exist;
    expect(welcome.text()).to.match(/TODO/);
  });
});
