import React, { useState } from 'react';
import './App.scss';
import UploadForm from './UploadForm';
import NoWorkerConverter from './utils/noWorkerConverer';
import BackendForm from './components/BackendForm';
import classNames from 'classnames';

const noWorkerConverter = new NoWorkerConverter();

const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
function App() {
  const [file, setFile] = useState<HTMLImageElement | null>(null);
  const [dragEnter, setDragEnter] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

const onClick = () => {
    // use file upload
    const input = this.refs.input;
    input.value = null;
    input.click();
  }

  const onDragEnter = (e: any) => {
    e.preventDefault();
    this.setState({ dragEnter: true });
  }

  const onDragOver = (e: any) => {
    e.preventDefault();
  }

  const onDragLeave = (e: any) => {
    e.preventDefault();
    this.setState({ dragEnter: false });
  }

  const onDrop = (e: any) => {
    e.preventDefault();
    setDragEnter(false);
    setHasError(false);
    setErrorMessage('');

    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    // check only one
    let file = files[0];

    if (allowedTypes.indexOf(file.type) > -1) {
      const canvas = ReactDOM.findDOMNode(this.refs.photo);
      let image = new Image();

      // note case!
      // image.onload = () => { this.renderImage(canvas, image); };
      image.src = window.URL.createObjectURL(file);

      // this.props.handleImageUpload(window.URL.createObjectURL(file));
      setFile(image)
      // this.setState({ image });
    } else {
      setHasError(true);
      setErrorMessage('Image type not recognised');
      // this.setState({
      //   error: true,
      //   errorMessage: 'Image type not recognised'
      // });
    }
  }

      const classes = classNames({
      'upload': true,
      'upload--drag-enter': dragEnter,
      // 'upload--has-file': this.state.preview,
      // 'upload--error': this.state.error
    });

    const errorClasses = classNames({
      'error-message': true,
      // 'error-message--visible': this.state.error
    });
  return (
    <div className="App">
      {/* //@ts-ignore */}
    {/* <UploadForm converter={noWorkerConverter}/> */}
    <BackendForm />
            <div
          className={ classes }
          onClick={ onClick }
          onDrop={ onDrop }
          onDragEnter={ onDragEnter }
          onDragOver={ onDragOver }
          onDragLeave={ onDragLeave }>

          <div className='instructions instructions--standard'>
            Drag an image here, or <button className='button icon-arrow-up'>upload</button>
          </div>
          <span className='instructions instructions--drop'>
            Drop it!
          </span>

          <input type='file' ref='input' onChange={ onDrop } className='input' />
          <canvas ref='photo' className='canvas'></canvas>
        </div>
    </div>
  );
}

export default App;
