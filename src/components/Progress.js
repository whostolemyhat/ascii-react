import React from 'react';
import PropTypes from 'prop-types';

export default class Progress extends React.Component {
  static propTypes = {
    percentComplete: PropTypes.number
  };

    // TODO: move this to a preview component
  updateImg (src) {
    this.setState({ img: src });
    this.renderPreview();
  }

  renderPreview () {
    if (this.state.img) {
      return (
        <img className='preview' src={ this.state.img } />
      );
    }
  }

  render () {
    return (
      <div className='progress'>
        <i className='progress__spinner icon-spinner8'></i>
        Working...
        <progress
          className='progress__bar'
          value={ this.props.percentComplete }
          max='100' />
      </div>
    );
  };
}
