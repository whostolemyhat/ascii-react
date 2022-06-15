import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import './styles/core.scss';
// import BackendForm from './components/BackendForm';
import { Output } from './components/Output';
import { Progress } from './components/Progress';
import AsciiConverter from './utils/asciiConverter';
import NoWorkerConverter from './utils/noWorkerConverer';
import PoolConverter from './utils/poolConverter';
import { AppState, Converter, Options } from './utils/types';
import { Preview } from './components/Preview';
import { IConverter } from './utils/IConverter';

export const noWorkerConverter = new NoWorkerConverter();
export const asciiConverter = new AsciiConverter();
export const poolConverter = new PoolConverter();

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

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
