import classNames from 'classnames';
import { FormEvent, useEffect, useRef, useState } from 'react';
import './styles/core.scss';
// import BackendForm from './components/BackendForm';
import { Output } from './components/Output';
import { Progress } from './components/Progress';
import { IConverter } from './utils/IConverter';
import AsciiConverter from './utils/asciiConverter';
import NoWorkerConverter from './utils/noWorkerConverer';
import PoolConverter from './utils/poolConverter';
import { Converter, Options } from './utils/types';

enum AppState {
  UPLOAD,
  PREVIEW,
  LOADING,
  RESULT,
}

const noWorkerConverter = new NoWorkerConverter();
const asciiConverter = new AsciiConverter();
const poolConverter = new PoolConverter();

function convertImage(
  imageData: ImageData,
  options: Options,
  worker: IConverter,
) {
  worker.toAscii(imageData, options);
}

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

const Preview = ({
  file,
  clear,
  canvas,
  options,
  setAppState,
}: {
  file: string;
  clear: any;
  canvas?: HTMLCanvasElement | null;
  options: Options;
  setAppState: (state: AppState) => void;
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

  let converter: IConverter = asciiConverter;
  switch (options.converter) {
    case Converter.None:
      converter = noWorkerConverter;
      break;
    case Converter.Pool:
      converter = poolConverter;
      break;
    default:
      converter = asciiConverter;
      break;
  }

  return (
    <>
      <img src={file} className="preview" />
      <button
        type="submit"
        onClick={(e) => {
          e.preventDefault();
          setAppState(AppState.LOADING);

          // switch between converters here
          convertImage(imageData, options, converter);
        }}
      >
        Convert
      </button>
      <button onClick={() => clear()}>Clear</button>
    </>
  );
};

function App() {
  const [file, setFile] = useState('');
  const [dragEnter, setDragEnter] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState(0);
  const [converter, setConverter] = useState(Converter.Single);

  const [appState, setAppState] = useState(AppState.UPLOAD);

  const input = useRef(null); // file input
  const photo = useRef(null); // canvas

  const handleDataReceived = (data: number) => {
    console.log('got some data', data);
    const progress = data.toFixed(1);
    setProgress(Number(progress));
  };

  const handleImageComplete = (data: string) => {
    console.log('complete', data);
    setResult(data);
    setAppState(AppState.RESULT);
  };

  useEffect(() => {
    console.log('adding listeners');

    noWorkerConverter.on('progress', (data: any) => handleDataReceived(data));
    noWorkerConverter.on('result', handleImageComplete);

    asciiConverter.on('progress', (data: any) => handleDataReceived(data));
    asciiConverter.on('result', handleImageComplete);

    poolConverter.on('progress', (data: any) => handleDataReceived(data));
    poolConverter.on('result', handleImageComplete);
  }, []);

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
      setAppState(AppState.PREVIEW);
    } else {
      console.error(`Couldn't get context`);
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

    if (allowedTypes.indexOf(file.type) > -1) {
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

      setFile(window.URL.createObjectURL(file));
      // have to set appstate.preview after rendering to canvas, not here
    } else {
      setHasError(true);
      setErrorMessage('Image type not recognised');
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
    converter,
  };

  let child = null;
  switch (appState) {
    case AppState.PREVIEW:
      child = (
        <Preview
          file={file}
          clear={() => {
            setFile('');
            setAppState(AppState.UPLOAD);
          }}
          canvas={photo.current}
          options={options}
          setAppState={setAppState}
        />
      );
      break;

    case AppState.LOADING:
      // child = `Loading ${progress}%`;
      child = <Progress percent={progress} />;
      break;

    case AppState.RESULT:
      child = (
        <Output
          result={result}
          reset={() => {
            setFile('');
            setAppState(AppState.UPLOAD);
          }}
        />
      );
      break;

    case AppState.UPLOAD:
    default:
      child = (
        <form>
          <div>
            <input
              type="radio"
              name="converter"
              value="none"
              id="none"
              checked={converter === Converter.None}
              onChange={() => setConverter(Converter.None)}
            />
            <label htmlFor="none">Single thread</label>
            <input
              type="radio"
              name="converter"
              value="single"
              id="single"
              checked={converter === Converter.Single}
              onChange={() => setConverter(Converter.Single)}
            />
            <label htmlFor="single">Background worker</label>
            <input
              type="radio"
              name="converter"
              value="pool"
              id="pool"
              checked={converter === Converter.Pool}
              onChange={() => setConverter(Converter.Pool)}
            />
            <label htmlFor="pool">Multi-worker</label>
          </div>
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
        </form>
      );
      break;
  }
  return (
    <div className="App">
      {/* <UploadForm converter={noWorkerConverter}/> */}
      {/* <BackendForm /> */}
      <canvas ref={photo} className="canvas"></canvas>
      {child}
    </div>
  );
}

export default App;