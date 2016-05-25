import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

export default class UploadForm extends React.Component {
  static propTypes = {
    handleImageUpload: React.PropTypes.func.isRequired,
    handleImageProcessing: React.PropTypes.func.isRequired,
    converter: React.PropTypes.object.isRequired
  };

  state = {
    preview: null,
    dragEnter: false,
    allowedTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png'
    ],
    resolution: 1,
    invert: false
  };

  onClick = () => {
    // use file upload
    const input = this.refs.input;
    input.value = null;
    input.click();
  }

  onDragEnter = e => {
    e.preventDefault();
    this.setState({ dragEnter: true });
  }

  onDragOver = e => {
    e.preventDefault();
  }

  onDragLeave = e => {
    e.preventDefault();
  }

  onDrop = e => {
    e.preventDefault();
    this.setState({ dragEnter: false });

    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

      // check only one
    let file = files[0];

    if (this.state.allowedTypes.indexOf(file.type) > -1) {
      const canvas = ReactDOM.findDOMNode(this.refs.photo);
      let image = new Image();

      // note case!
      image.onload = () => { this.renderImage(canvas, image); };
      image.src = window.URL.createObjectURL(file);

      this.props.handleImageUpload(window.URL.createObjectURL(file));
      this.setState({ image });
    }
  }

  handleResolutionChange = e => {
    this.setState({ resolution: e.target.value });
  }

  handleInvertChange = () => {
    this.setState({ invert: !this.state.invert });
  }

  renderImage = (canvas, image) => {
    // resize canvas to image
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    this.props.handleImageProcessing();
    this.props.converter.toAscii(
      context.getImageData(0, 0, canvas.width, canvas.height),
      {
        resolution: this.state.resolution,
        invert: this.state.invert
      }
    );
  }

  render () {
    const classes = classnames({
      'upload': true,
      'upload--drag-enter': this.state.dragEnter,
      'upload--has-file': this.state.preview
    });

    return (
      <div className='upload__wrapper'>
        <label htmlFor='resolution'>Resolution (lower = better quality but slower)</label>
        <input type='number'
          name='resolution'
          id='resolution'
          onChange={this.handleResolutionChange}
          value={this.state.resolution}
          step='1'
          min='1' />

        <label htmlFor='invert'>Invert characters</label>
        <input type='checkbox'
          name='invert'
          id='invert'
          onChange={this.handleInvertChange}
          checked={this.state.invert} />

        <div
          className={classes}
          onClick={this.onClick}
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}>

          {this.props.children}

          <input type='file' ref='input' onChange={this.onDrop} className='input' />
          <canvas ref='photo' className='canvas'></canvas>
        </div>
      </div>
    );
  }
}
