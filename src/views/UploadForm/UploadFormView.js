import React from 'react';
import { connect } from 'react-redux';

import AsciiConverter from '../services/asciiConverter';
import NoWorkerConverter from '../services/noWorkerConverter';
import PoolConverter from '../services/poolConverter';

import UploadForm from '../components/UploadForm/UploadForm';
import Progress from '../components/Progress/Progress';
import Preview from '../components/Preview/Preview';
import ResultsContainer from '../components/Result/ResultsContainer';

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
    src: React.PropTypes.string,
    options: React.PropTypes.object
  }

  state = {
    numWorkers: 2,
    workerOption: 'no'
  };

  handleNumWorkerChange = e => {
    // console.log(e.target.value);
    this.setState({ numWorkers: e.target.value });
  }

  handleWorkerChange = e => {
    this.setState({ workerOption: e.target.value });
  }

  componentWillMount () {
    this.ascii = new AsciiConverter();
    this.ascii.on('progress', data => this.props.handleDataReceived(data));
    this.ascii.on('result', this.props.handleImageComplete);

    this.noWorker = new NoWorkerConverter();
    this.noWorker.on('progress', data => this.props.handleDataReceived(data));
    this.noWorker.on('result', this.props.handleImageComplete);

    this.poolWorker = new PoolConverter();
    this.poolWorker.on('progress', data => this.props.handleDataReceived(data));
    this.poolWorker.on('result', this.props.handleImageComplete);
  }

  render () {
    console.log('hiya here');

    // TODO quick hack for demo
    let worker;
    switch (this.state.workerOption) {
    case 'no':
      worker = this.noWorker;
      break;
    case 'one':
      worker = this.ascii;
      break;
    case 'multi':
      worker = this.poolWorker;
      break;
    }

    console.log('worker', worker);

    return (
      <div>
        <form>
          <label><input type="radio" onClick={ this.handleWorkerChange } value="no" name="noWorker" checked={ this.state.workerOption === 'no' } /> No worker</label>
          <label><input type="radio" onClick={ this.handleWorkerChange } value="one" name="singleWorker" checked={ this.state.workerOption === 'one' } /> Single worker</label>
          <label><input type="radio" onClick={ this.handleWorkerChange } value="multi" name="singleWorker" checked={ this.state.workerOption === 'multi' } /> Multi worker</label>
          <input
            id='numberWorkers'
            className='result__size'
            type='range'
            min='2'
            max='32'
            value={ this.state.numWorkers }
            onChange={ this.handleNumWorkerChange } /> { this.state.numWorkers }
        </form>

        { this.props.visible === 'UPLOAD'
          ? <UploadForm
            converter={ worker }
            handleImageUpload={ this.props.handleImageUpload }
            handleImageProcessing={ this.props.handleImageProcessing } />
          : null }
        { this.props.visible === 'PROGRESS' || this.props.visible === 'RESULT'
          ? <Preview src={ this.props.src } />
          : null }
        { this.props.visible === 'PROGRESS'
          ? <Progress
            percentComplete={ this.props.percentComplete } />
          : null }
        { this.props.visible === 'RESULT'
          ? <ResultsContainer
            options={ this.props.options }
            output={ this.props.output }
            handleReset={ this.props.handleReset } />
          : null }
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

    handleImageProcessing: options => {
      dispatch(imageProcessing(options));
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
