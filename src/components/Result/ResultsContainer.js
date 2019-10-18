import React from 'react';
import PropTypes from 'prop-types';
import Result from './Result';

export default class ResultsContainer extends React.Component {
  static propTypes = {
    output: PropTypes.string,
    handleReset: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired
  }

  state = {
    size: 4
  };

  handleResetClick = e => {
    e.preventDefault();
    this.props.handleReset();
  }

  handleFontSizeChange = e => {
    this.setState({ size: e.target.value });
  }

  getEncodedResult () {
    let openWrapper = '';
    let closeWrapper = '';
    let dataType = 'text/plain';

    if (this.props.options.colour) {
      openWrapper = '<pre>';
      closeWrapper = '</pre>';
      dataType = 'text/html';
    }

    // ignore long line - using 'pre'
    /* eslint-disable max-len */
    return `data:${ dataType };charset=utf-8,${ encodeURIComponent(openWrapper) }${ encodeURIComponent(this.props.output) }${ encodeURIComponent(closeWrapper) }`;
    /* eslint-enable max-len */
  }

  render () {
    return (
      <div className='results-container'>
        <label htmlFor='size'>Size: </label>
        <input
          id='size'
          className='result__size'
          type='range'
          min='4'
          max='25'
          value={ this.state.size }
          onChange={ this.handleFontSizeChange } />

        <Result
          output={ this.props.output }
          size={ this.state.size }
          options={ this.props.options } />

        <nav className='result__nav'>
          <a
            href={ this.getEncodedResult() }
            className='result__download button icon-arrow-down'
            download={ this.props.options.colour ? 'ascii.html' : 'ascii.txt' }>
            Download
          </a>

          <a href='/upload'
            className='result__reset button icon-arrow-up'
            onClick={ this.handleResetClick }>
              Upload another image
          </a>
        </nav>
      </div>
    );
  }
}
