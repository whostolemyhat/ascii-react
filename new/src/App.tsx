import React, { useRef, useState } from 'react';
// import './App.scss';
import './styles/core.scss';
import UploadForm from './UploadForm';
import NoWorkerConverter, { Options, Pixels } from './utils/noWorkerConverer';
import BackendForm from './components/BackendForm';
import classNames from 'classnames';

const noWorkerConverter = new NoWorkerConverter();

// type ConversionOptions = {
//   resolution: number,
//   colour: boolean,
//   invert: boolean,
//   whitespace: boolean,
//   numWorkers: number
// }
function handleImageUpload(imageData: Pixels, options: Options) {
  noWorkerConverter.toAscii(
    imageData,
    options
  );
}

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

  const input = useRef(null);
  const photo = useRef(null);

  const handleDataReceived = (data: any) => {
    console.log('got some data', data);
  }

  const handleImageComplete = (data: any) => {
    console.log('complete', data);
  }

  noWorkerConverter.on("progress", (data: any) =>
    handleDataReceived(data)
  );
  noWorkerConverter.on("result", handleImageComplete);



  const onClick = () => {
    // use file upload
    if (input.current) {
      // @ts-ignore
      input.current.value = null;
      // @ts-ignore
      input.current?.click();
    } else {
      console.error('No input ref set');
    }
  }

  const onDragEnter = (e: any) => {
    e.preventDefault();
    setDragEnter(true);
  }

  const onDragOver = (e: any) => {
    e.preventDefault();
  }

  const onDragLeave = (e: any) => {
    e.preventDefault();
    setDragEnter(false);
  }

  const onDrop = (e: any) => {
    e.preventDefault();
    setDragEnter(false);
    setHasError(false);
    setErrorMessage('');

    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    // check only one
    let file = files[0];

    console.log('got a file', file);

    if (allowedTypes.indexOf(file.type) > -1) {
      // const canvas = ReactDOM.findDOMNode(photo);
      const canvas = photo.current;
      let image = new Image();

      // note case!
      // image.onload = () => { renderImage(canvas, image); };
      image.src = window.URL.createObjectURL(file);

      // handleImageUpload(window.URL.createObjectURL(file));
      if (canvas) {
        // @ts-ignore
        const context = canvas.getContext('2d')
        // @ts-ignore
        handleImageUpload(context.getImageData(0, 0, canvas.width, canvas.height), {});
      }
      setFile(image)
    } else {
      setHasError(true);
      setErrorMessage('Image type not recognised');
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

          <input type='file' ref={input} onChange={ onDrop } className='input' />
          <canvas ref={photo} className='canvas'></canvas>
        </div>
    </div>
  );
}

export default App;
