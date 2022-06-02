import classNames from 'classnames';
import { FormEvent, useRef, useState } from 'react';
import './styles/core.scss';
import BackendForm from './components/BackendForm';
import NoWorkerConverter, { Options } from './utils/noWorkerConverer';

const noWorkerConverter = new NoWorkerConverter();

// type ConversionOptions = {
//   resolution: number,
//   colour: boolean,
//   invert: boolean,
//   whitespace: boolean,
//   numWorkers: number
// }

function convertImage(imageData: ImageData, options: Options) {
  console.log('image data', imageData);
  // @ts-ignore
  noWorkerConverter.toAscii(imageData, options);
}

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const Preview = ({
  file,
  clear,
  canvas,
  options,
}: {
  file: string;
  clear: any;
  canvas?: HTMLCanvasElement | null;
  options: Options;
}) => {
  if (!canvas) {
    console.error('no canvas found');
    return null;
  }
  const context = canvas?.getContext('2d');
  const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
  if (!imageData) {
    console.error(`Couldn't convert image`);
    return null;
  }
  return (
    <>
      <img src={file} className="preview" />
      <button type="submit" onClick={() => convertImage(imageData, options)}>
        Convert
      </button>
      <button onClick={() => clear()}>Clear</button>
    </>
  );
};

const Output = ({ result }: { result: string }) => {
  return (
    <div className="results">
      <pre className="result" style={{ fontSize: '4px' }}>
        <code>{result}</code>
      </pre>
    </div>
  );
};

function App() {
  const [file, setFile] = useState('');
  const [dragEnter, setDragEnter] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState('');

  const input = useRef(null); // file input
  const photo = useRef(null); // canvas

  const handleDataReceived = (data: any) => {
    console.log('got some data', data);
  };

  const handleImageComplete = (data: any) => {
    console.log('complete', data);
    setResult(data);
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

  const renderImage = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    // resize canvas to image
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(image, 0, 0);
    }
  };

  const onDrop = (e: any) => {
    e.preventDefault();
    setDragEnter(false);
    setHasError(false);
    setErrorMessage('');

    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    // check only one
    const file = files[0];

    console.log('got a file', file);

    if (allowedTypes.indexOf(file.type) > -1) {
      // const canvas = ReactDOM.findDOMNode(photo);
      const canvas = photo.current;
      const image = new Image();
      if (canvas) {
        // note case!
        image.onload = () => {
          renderImage(canvas, image);
        };
        image.src = window.URL.createObjectURL(file);
      } else {
        console.error('No canvas found');
      }

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
      convertImage(
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

  const options: Options = {
    resolution: 1,
    colour: false,
    whitespace: '',
    invert: false,
  };
  return (
    <div className="App">
      {/* <UploadForm converter={noWorkerConverter}/> */}
      <BackendForm />
      <canvas ref={photo} className="canvas"></canvas>
      {result && <Output result={result} />}
      <form onSubmit={processForm}>
        {file ? (
          <Preview
            file={file}
            clear={setFile}
            canvas={photo.current}
            options={options}
          />
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

export default App;
