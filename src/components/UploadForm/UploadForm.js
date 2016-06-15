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
    resolution: 4,
    invert: false,
    colour: false,
    whitespace: 'dots',
    error: false
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
    this.setState({ dragEnter: false });
  }

  onDrop = e => {
    e.preventDefault();
    this.setState({
      dragEnter: false,
      error: false,
      errorMessage: ''
    });

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
    } else {
      this.setState({
        error: true,
        errorMessage: 'Image type not recognised'
      });
    }
  }

  handleResolutionChange = e => {
    this.setState({ resolution: e.target.value });
  }

  handleInvertChange = () => {
    this.setState({ invert: !this.state.invert });
  }

  handleColourChange = () => {
    this.setState({ colour: !this.state.colour });
  }

  handleWhitespaceChange = e => {
    this.setState({ whitespace: e.target.value });
  }

  renderImage = (canvas, image) => {
    // resize canvas to image
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const options = {
      resolution: this.state.resolution,
      invert: this.state.invert,
      colour: this.state.colour,
      whitespace: this.state.whitespace
    };

    this.props.handleImageProcessing(options);
    this.props.converter.toAscii(
      context.getImageData(0, 0, canvas.width, canvas.height),
      options
    );
  }

  render () {
    const classes = classnames({
      'upload': true,
      'upload--drag-enter': this.state.dragEnter,
      'upload--has-file': this.state.preview,
      'upload--error': this.state.error
    });

    const errorClasses = classnames({
      'error-message': true,
      'error-message--visible': this.state.error
    });

    return (
      <div className='upload__wrapper'>
        <div className='form__options'>
          <div className='form-row'>
            <label htmlFor='resolution'>Quality
              <span className='label__info'>(lower = better quality but slower)</span>
            </label>
            <input type='number'
              name='resolution'
              id='resolution'
              onChange={ this.handleResolutionChange }
              value={ this.state.resolution }
              step='1'
              min='1' />
          </div>

          <div className='form-row'>
            <label htmlFor='invert'>Invert characters</label>
            <input type='checkbox'
              name='invert'
              id='invert'
              onChange={ this.handleInvertChange }
              checked={ this.state.invert } />
          </div>

          <div className='form-row'>
            <label htmlFor='colour'>Colour</label>
            <input type='checkbox'
              name='colour'
              id='colour'
              onChange={ this.handleColourChange }
              checked={ this.state.colour } />
          </div>

          <div className='form-row'>
            Whitespace:&nbsp;
            <label htmlFor='dots'>use dots</label>
            <input type='radio'
              name='dots'
              id='dots'
              onChange={ this.handleWhitespaceChange }
              checked={ this.state.whitespace === 'dots' }
              value='dots' />

            <label htmlFor='whitespace'>use spaces</label>
            <input type='radio'
              name='whitespace'
              id='whitespace'
              onChange={ this.handleWhitespaceChange }
              checked={ this.state.whitespace === 'spaces' }
              value='spaces' />
          </div>
        </div>

        <div className={ errorClasses }>{ this.state.errorMessage }</div>
        <div
          className={ classes }
          onClick={ this.onClick }
          onDrop={ this.onDrop }
          onDragEnter={ this.onDragEnter }
          onDragOver={ this.onDragOver }
          onDragLeave={ this.onDragLeave }>

          <span className='instructions instructions--standard'>
            Drag an image here, or click to upload
          </span>
          <span className='instructions instructions--drop'>
            Drop it!
          </span>

          <input type='file' ref='input' onChange={ this.onDrop } className='input' />
          <canvas ref='photo' className='canvas'></canvas>
        </div>

        <p className='upload__copy'>Convert your pictures into text or HTML - easy to copy and paste into blogs.
        Black-and-white images are converted into text format, and the colour option converts
        pictures into HTML.</p>

        <p className='upload__copy'>Choose between allowing white space to be
         shown as spaces or as dots, and try inverting
        the characters used to get the best results. The quality setting changes how many pixels are
        used per character in the output - lower numbers in the quality setting will result in a
        better-looking result, but will take longer.</p>
      </div>
    );
  }
}
