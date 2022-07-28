import { IConverter } from '../utils/IConverter';
import { AppState, ConversionOptions } from '../utils/types';

function convertImage(
  imageData: ImageData,
  options: ConversionOptions,
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
  options: ConversionOptions;
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
    <div className="preview">
      <img src={file} className="preview__img" />
      <button
        className="preview__submit button--primary"
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
      <button
        data-testid="preview-clear"
        onClick={() => clear()}
        className="preview__cancel button--secondary"
      >
        Cancel
      </button>
    </div>
  );
};
