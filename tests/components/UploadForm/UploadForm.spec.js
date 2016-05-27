import React from 'react';
import UploadForm from 'components/UploadForm/UploadForm';
import { shallow } from 'enzyme';
import sinon from 'sinon';

describe('(Component) UploadForm', () => {
  let _component, _props;

  beforeEach(() => {
    _props = {
      handleImageUpload: sinon.spy(),
      handleImageProcessing: sinon.spy(),
      converter: sinon.spy()
    };

    _component = shallow(<UploadForm { ..._props } />);
  });

  it('Renders', () => {
    expect(_component.find('.upload')).to.exist;
  });

  it('should have a file input', () => {
    const input = _component.find('.input');
    expect(input).to.exist;
    expect(input.props().type).to.equal('file');
  });

  it('should have a canvas', () => {
    const canvas = _component.find('.canvas');
    expect(canvas).to.exist;
  });

  describe('options', () => {
    it('should have a resolution input', () => {
      expect(_component.find('#resolution')).to.exist;
      expect(_component.find('#resolution').prop('type')).to.equal('number');
    });

    it('should handle resolution change', () => {
      _component.find('#resolution').simulate('change', { target: { value: 3 } });
      expect(_component.state('resolution')).to.equal(3);
    });

    it('should have an inversion input', () => {
      expect(_component.find('#invert')).to.exist;
      expect(_component.find('#invert')).prop('type').to.equal('checkbox');
    });

    it('should handle invert change', () => {
      _component.find('#invert').simulate('change');
      expect(_component.state('invert')).to.be.true;
    });

    it('should have a colour input', () => {
      expect(_component.find('#colour')).to.exist;
      expect(_component.find('#colour').prop('type')).to.equal('checkbox');
    });

    it('should handle colour change', () => {
      _component.find('#colour').simulate('change');
      expect(_component.state('colour')).to.be.true;
    });

    it('should have whitespace inputs', () => {
      expect(_component.find('#dots')).to.exist;
      expect(_component.find('#dots').prop('type')).to.equal('radio');
      expect(_component.find('#whitespace')).to.exist;
      expect(_component.find('#whitespace').prop('type')).to.equal('radio');
    });

    it('should handle whitespace change', () => {
      _component.find('#whitespace').simulate('click', { target: { value: 'spaces' } });
      expect(_component.state('whitespace')).to.equal('spaces');
    });
  });
});
