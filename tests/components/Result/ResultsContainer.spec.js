import React from 'react';
import { shallow } from 'enzyme';

import ResultsContainer from 'components/Result/ResultsContainer';
import Result from 'components/Result/Result';

describe('(component) ResultsContainer', () => {
  let _component, _props, resetStub;

  beforeEach(() => {
    resetStub = sinon.spy();

    _props = {
      output: 'testOutput',
      handleReset: resetStub
    };

    _component = shallow(<ResultsContainer { ..._props } />);
  });

  it('renders', () => {
    expect(_component.find('.results-container')).to.exist;
  });

  it('shows a result', () => {
    expect(_component.find(Result)).to.exist;
  });

  describe('navigation', () => {
    it('shows navigation', () => {
      expect(_component.find('.result__nav')).to.exist;
    });

    it('handles reset', () => {
      _component.find('.result__reset').simulate('click', { preventDefault: sinon.spy() });

      expect(resetStub).to.have.been.called;
    });

    it('handles download', () => {
      const link = _component.find('.result__download');

      expect(link.prop('download')).to.match(/ascii.txt/);
      expect(link.prop('href'))
        .to.equal('data:text/plain;charset=utf-8,' + encodeURIComponent('testOutput'));
    });
  });

  describe('font size', () => {
    it('has a size slider', () => {
      const input = _component.find('.result__size');
      expect(input).to.exist;
      expect(input.prop('value')).to.equal(4);
    });

    it('handles size change', () => {
      const input = _component.find('.result__size');
      input.simulate('change', { target: { value: 6 } });

      expect(_component.state('size')).to.equal(6);
    });
  });
});