import classNames from 'classnames';
import React, { FormEvent, useRef, useState } from 'react';
import './styles/core.scss';
// import UploadForm from './UploadForm';
import NoWorkerConverter, { Options, Pixels } from './utils/noWorkerConverer';
import BackendForm from './components/BackendForm';

const noWorkerConverter = new NoWorkerConverter();

// type ConversionOptions = {
//   resolution: number,
//   colour: boolean,
//   invert: boolean,
//   whitespace: boolean,
//   numWorkers: number
// }

function showImagePreview(
  canvasContext: CanvasRenderingContext2D,
  image: CanvasImageSource,
) {
  console.log('drawiign');
  canvasContext.drawImage(image, 0, 0);
}

function handleImageUpload(imageData: Pixels, options: Options) {
  noWorkerConverter.toAscii(imageData, options);
}

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

function App() {
  const [file, setFile] = useState('');
  const [dragEnter, setDragEnter] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const input = useRef(null); // file input
  const photo = useRef(null); // canvas

  const handleDataReceived = (data: any) => {
    console.log('got some data', data);
  };

  const handleImageComplete = (data: any) => {
    console.log('complete', data);
  };

  noWorkerConverter.on('progress', (data: any) => handleDataReceived(data));
  noWorkerConverter.on('result', handleImageComplete);

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
  };

  const onDragEnter = (e: any) => {
    e.preventDefault();
    setDragEnter(true);
  };

  const onDragOver = (e: any) => {
    e.preventDefault();
  };

  const onDragLeave = (e: any) => {
    e.preventDefault();
    setDragEnter(false);
  };

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
      // const canvas = photo.current;
      // let image = new Image();

      // note case!
      // image.onload = () => { renderImage(canvas, image); };
      // image.src = window.URL.createObjectURL(file);

      // handleImageUpload(window.URL.createObjectURL(file));
      // if (canvas) {
      // @ts-ignore
      // const context = canvas.getContext('2d')
      // @ts-ignore
      // handleImageUpload(context.getImageData(0, 0, canvas.width, canvas.height), {});
      // }
      setFile(window.URL.createObjectURL(file));
    } else {
      setHasError(true);
      setErrorMessage('Image type not recognised');
    }
  };
  const processForm = (e: FormEvent) => {
    e.preventDefault();
    const canvas = photo.current;
    console.log('processing');
    console.log(canvas, file);
    if (canvas && file) {
      // @ts-ignore
      const context = canvas.getContext('2d');
      // showImagePreview(context, file);
      handleImageUpload(
        // @ts-ignore
        context.getImageData(0, 0, canvas.width, canvas.height),
        // @ts-ignore
        {},
      );
    }
  };

  const classes = classNames({
    upload: true,
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
      <canvas ref={photo} className="canvas"></canvas>
      <form onSubmit={processForm}>
        {file ? (
          <Preview file={file} clear={setFile} />
        ) : (
          <div
            onClick={onClick}
            onDrop={onDrop}
            className={classes}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            <div className="instructions instructions--standard">
              Drag an image here, or{' '}
              <button className="button icon-arrow-up">upload</button>
            </div>
            <span className="instructions instructions--drop">Drop it!</span>

            <input
              type="file"
              ref={input}
              onChange={onDrop}
              className="input"
            />
          </div>
        )}
      </form>
    </div>
  );
}

const Preview = ({ file, clear }: { file: string; clear: any }) => {
  return (
    <>
      <img src={file} className="preview" />
      <button type="submit">Convert</button>
      <button onClick={() => clear()}>Clear</button>
    </>
  );
};

export default App;
