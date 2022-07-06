import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import './styles/core.scss';
// import BackendForm from './components/BackendForm';
import { Output } from './components/Output';
import { OutputCanvas } from './components/OutputCanvas';
import { Preview } from './components/Preview';
import { Progress } from './components/Progress';
import { IConverter } from './utils/IConverter';
import AsciiConverter from './utils/asciiConverter';
import NoWorkerConverter from './utils/noWorkerConverer';
import PassValueConverter from './utils/passValueConverter';
import PoolConverter from './utils/poolConverter';
import SharedBufferConverter from './utils/sharedBufferConverter';
import SharedPoolConverter from './utils/sharedPoolConverter';
import { AppState, Converter, Options } from './utils/types';

export const noWorkerConverter = new NoWorkerConverter();
export const asciiConverter = new AsciiConverter();
export const poolConverter = new PoolConverter();
export const sharedConverter = new SharedBufferConverter();
export const sharedPoolConverter = new SharedPoolConverter();
export const passValueConverter = new PassValueConverter();

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

function App() {
  const [file, setFile] = useState('');
  const [dragEnter, setDragEnter] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState('');
  const [progress, setProgress] = useState(0);
  const [converter, setConverter] = useState(Converter.Buffer);
  const [imgDimensions, setImgDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [appState, setAppState] = useState(AppState.UPLOAD);

  const input = useRef(null); // file input
  const photo = useRef(null); // canvas

  const handleDataReceived = (data: number) => {
    const progress = data.toFixed(1);
    setProgress(Number(progress));
  };

  const handleImageComplete = (data: string) => {
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

    sharedConverter.on('progress', (data: any) => handleDataReceived(data));
    sharedConverter.on('result', handleImageComplete);

    sharedPoolConverter.on('progress', (data: any) => handleDataReceived(data));
    sharedPoolConverter.on('result', handleImageComplete);

    passValueConverter.on('progress', (data: any) => handleDataReceived(data));
    passValueConverter.on('result', handleImageComplete);
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
    setImgDimensions({ width: image.width, height: image.height });
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
    resolution: 2,
    colour: false,
    whitespace: '',
    invert: false,
  };

  let child = null;
  switch (appState) {
    case AppState.PREVIEW:
      let selectedConverter: IConverter = asciiConverter;
      switch (converter) {
        case Converter.None:
          selectedConverter = noWorkerConverter;
          break;
        case Converter.Pool:
          selectedConverter = poolConverter;
          break;
        case Converter.Buffer:
          selectedConverter = sharedConverter;
          break;
        case Converter.PassValue:
          selectedConverter = passValueConverter;
          break;
        case Converter.SharedPool:
          selectedConverter = sharedPoolConverter;
          break;
        default:
          selectedConverter = asciiConverter;
          break;
      }
      child = (
        <Preview
          file={file}
          clear={() => {
            setFile('');
            setAppState(AppState.UPLOAD);
          }}
          canvas={photo.current}
          converter={selectedConverter}
          options={options}
          setAppState={setAppState}
        />
      );
      break;

    case AppState.LOADING:
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
        // <OutputCanvas
        //   result={result}
        //   imgDimensions={imgDimensions}
        //   reset={() => {
        //     setFile('');
        //     setAppState(AppState.UPLOAD);
        //   }}
        // />
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
            <input
              type="radio"
              name="converter"
              value="value"
              id="value"
              checked={converter === Converter.PassValue}
              onChange={() => setConverter(Converter.PassValue)}
            />
            <label htmlFor="value">Pass by value</label>
            <input
              type="radio"
              name="converter"
              value="buffer"
              id="buffer"
              checked={converter === Converter.Buffer}
              onChange={() => setConverter(Converter.Buffer)}
            />
            <label htmlFor="buffer">Shared array buffer</label>
            <input
              type="radio"
              name="converter"
              value="sharedpool"
              id="sharedpool"
              checked={converter === Converter.SharedPool}
              onChange={() => setConverter(Converter.SharedPool)}
            />
            <label htmlFor="sharedpool">Shared pool buffer</label>
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
