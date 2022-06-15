import { IConverter } from '../utils/IConverter';
import { AppState, Options } from '../utils/types';

function convertImage(
  imageData: ImageData,
  options: Options,
  worker: IConverter,
) {
  worker.toAscii(imageData, options);
}

export const Preview = ({
  file,
  clear,
  canvas,
  options,
  setAppState,
  converter,
}: {
  file: string;
  clear: () => void;
  canvas?: HTMLCanvasElement | null;
  options: Options;
  setAppState: (state: AppState) => void;
  converter: IConverter;
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
      <button
        data-testid="preview-submit"
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
      <button data-testid="preview-clear" onClick={() => clear()}>
        Clear
      </button>
    </>
  );
};
