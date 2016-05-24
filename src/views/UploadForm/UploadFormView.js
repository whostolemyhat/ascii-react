import React from 'react';
import { connect } from 'react-redux';

import AsciiConverter from 'services/asciiConverter';

import UploadForm from 'components/UploadForm/UploadForm';
import Progress from 'components/Progress/Progress';
import Preview from 'components/Preview/Preview';
import ResultsContainer from 'containers/ResultsContainer';

import {
  imageUpload,
  imageProcessing,
  dataReceived,
  imageComplete,
  reset
} from 'store/actions';

export class UploadFormView extends React.Component {
  static propTypes = {
    handleImageUpload: React.PropTypes.func.isRequired,
    handleImageProcessing: React.PropTypes.func.isRequired,
    handleDataReceived: React.PropTypes.func.isRequired,
    handleImageComplete: React.PropTypes.func.isRequired,
    handleReset: React.PropTypes.func.isRequired,
    visible: React.PropTypes.string,
    percentComplete: React.PropTypes.number,
    output: React.PropTypes.string,
    src: React.PropTypes.object
  }

  componentWillMount () {
    this.ascii = new AsciiConverter();
    this.ascii.on('progress', data => this.props.handleDataReceived(data));
    this.ascii.on('result', this.props.handleImageComplete);
  }

  render () {
    return (
      <div>
        {this.props.visible === 'UPLOAD'
          ? <UploadForm
            converter={this.ascii}
            handleImageUpload={this.props.handleImageUpload}
            handleImageProcessing={this.props.handleImageProcessing}>
            Drop an image here, or click to pick
          </UploadForm>
          : null}
        {this.props.visible === 'PROGRESS' || this.props.visible === 'RESULT'
          ? <Preview src={this.props.src} />
          : null}
        {this.props.visible === 'PROGRESS'
          ? <Progress
            percentComplete={this.props.percentComplete} />
          : null}
        {this.props.visible === 'RESULT'
          ? <ResultsContainer
            output={this.props.output}
            handleReset={this.props.handleReset} />
          : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.asciiApp
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    handleImageUpload: src => {
      dispatch(imageUpload(src));
    },

    handleImageProcessing: () => {
      dispatch(imageProcessing());
    },

    handleDataReceived: data => {
      dispatch(dataReceived(data));
    },

    handleImageComplete: data => {
      dispatch(imageComplete(data));
    },

    handleReset: () => {
      dispatch(reset());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadFormView);
