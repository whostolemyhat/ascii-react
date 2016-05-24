import React from 'react';
import Result from 'components/Result/Result';
// import _ from 'lodash';

export default class ResultContainer extends React.Component {
  static propTypes = {
    output: React.PropTypes.string,
    handleReset: React.PropTypes.func.isRequired
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

  render () {
    return (
      <div className='results-container'>
        <input
          className='result__size'
          type='range'
          min='4'
          max='25'
          value={this.state.size}
          onChange={this.handleFontSizeChange} />

        <Result
          output={this.props.output}
          size={this.state.size} />

        <nav>
          <ul>
            <li>
              <a
                href={'data:text/plain;charset=utf-8,' + encodeURIComponent(this.props.output)}
                download='ascii.txt'>
                Download
              </a>
            </li>
            <li><a href='/upload' onClick={this.handleResetClick}>Upload another image</a></li>
          </ul>
        </nav>
      </div>
    );
  }
}
