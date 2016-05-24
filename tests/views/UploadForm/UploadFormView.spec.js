import React from 'react';
import { shallow } from 'enzyme';
import EventEmitter from 'eventemitter3';

import UploadForm from 'components/UploadForm/UploadForm';
import Progress from 'components/Progress/Progress';
import Preview from 'components/Preview/Preview';
import ResultsContainer from 'components/Result/ResultsContainer';

describe('(View) UploadFormView', () => {
  let _component, _props, UploadFormView, converterStub;

  beforeEach(() => {
    class Converter extends EventEmitter {};
    converterStub = Converter;

    let inject = require('inject!views/UploadForm/UploadFormView');
    UploadFormView = inject({
      'services/asciiConverter': converterStub
    }).UploadFormView;
  });

  it('should render a form', () => {
    _props = {
      visible: 'UPLOAD'
    };

    _component = shallow(<UploadFormView { ..._props } />);

    expect(_component.find(UploadForm)).to.exist;
  });

  it('should render a progress bar', () => {
    _props = {
      visible: 'PROGRESS'
    };

    _component = shallow(<UploadFormView { ..._props } />);
    expect(_component.find(Progress)).to.exist;
  });

  it('should render a preview', () => {
    _props = {
      visible: 'PROGRESS'
    };

    _component = shallow(<UploadFormView { ..._props } />);
    expect(_component.find(Preview)).to.exist;
  });

  it('should render a results container', () => {
    _props = {
      visible: 'RESULT'
    };

    _component = shallow(<UploadFormView { ..._props } />);
    expect(_component.find(ResultsContainer)).to.exist;
  });

  describe('ascii converter', () => {
    let dataStub, imageStub;

    beforeEach(() => {
      dataStub = sinon.spy();
      imageStub = sinon.spy();

      _props = {
        visible: 'RESULT',
        handleDataReceived: dataStub,
        handleImageComplete: imageStub
      };

      _component = shallow(<UploadFormView { ..._props } />);
    });

    it('should have an instance of AsciiConverter', () => {
      expect(_component.instance().ascii).to.exist;
    });

    it('should handle progress events', () => {
      _component.instance().ascii.emit('progress', { hello: 'world' });

      expect(dataStub).to.have.been.calledWith({ hello: 'world' });
    });

    it('should handle result events', () => {
      _component.instance().ascii.emit('result', { hello: 'there' });

      expect(imageStub).to.have.been.calledWith({ hello: 'there' });
    });
  });
});
