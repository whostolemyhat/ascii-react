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
    const input = _component.find('input');
    expect(input).to.exist;
    expect(input.props().type).to.equal('file');
  });

  it('should have a canvas', () => {
    const canvas = _component.find('.canvas');
    expect(canvas).to.exist;
    // expect(canvas.props().ref).to.equal('photo');
  });
});
