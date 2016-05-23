import React from 'react';
import { shallow } from 'enzyme';
import { UploadFormView } from 'views/UploadForm/UploadFormView';

import UploadForm from 'components/UploadForm/UploadForm';
import Progress from 'components/Progress/Progress';
import Result from 'components/Result/Result';

describe('(View) UploadFormView', () => {
  let _component, _props;

  beforeEach(() => {

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

  it('should render a results container', () => {
    _props = {
      visible: 'RESULT'
    };

    _component = shallow(<UploadFormView { ..._props } />);
    expect(_component.find(Result)).to.exist;
  });
});
