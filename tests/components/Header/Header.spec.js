import React from 'react';
import { Header } from 'components/Header/Header';
// import { IndexLink } from 'react-router';
import { shallow } from 'enzyme';

describe('(component) Header', () => {
  let _wrapper;

  beforeEach(() => {
    _wrapper = shallow(<Header />);
  });

  it('Renders a welcome message', () => {
    const welcome = _wrapper.find('h1');
    expect(welcome).to.exist;
    expect(welcome.text()).to.match(/asciiPicture/);
  });

  // describe('Navigation links', () => {
  //   it('Should render an IndexLink to Home route', () => {
  //     expect(_wrapper.contains(<IndexLink to='/' />)).to.equal.true;
  //   });
  // });
});
