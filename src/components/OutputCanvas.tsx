import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';

function drawImage(
  canvas: HTMLCanvasElement,
  text: string,
  imgDimensions: { width: number; height: number },
) {
  const space = 5;
  const context = canvas.getContext('2d');
  canvas.height = imgDimensions.height * space;
  canvas.width = imgDimensions.width * space;

  if (context) {
    context.fillStyle = 'black';
    context.font = '5px sans-serif';
    let x = 0;
    let y = 0;
    for (let i = 0; i < text.length; i++) {
      context.fillText(text[i], x * space, y * space);
      x += 1;
      if (x === imgDimensions.width + 1) {
        x = 0;
        y += 1;
      }
    }
  } else {
    console.error(`Couldn't get context`);
  }
}

export const OutputCanvas = ({
  result,
  reset,
  imgDimensions,
}: {
  result: string;
  imgDimensions: { width: number; height: number };
  reset: () => void;
}) => {
  const picture = useRef<HTMLCanvasElement>(null);
  const [isZoomedIn, setZoomIn] = useState(false);

  useEffect(() => {
    if (picture.current) {
      drawImage(picture.current, result, imgDimensions);
    } else {
      console.error('No canvas ref');
    }
  }, [picture.current, result]);

  const canvasClasses = classNames('result__canvas', {
    'result__canvas--zoom': isZoomedIn,
  });

  return (
    <div className="results">
      <button data-testid="reset" onClick={reset} className="button--secondary">
        Restart
      </button>
      {imgDimensions.width * 4 > 800 && (
        <button
          className="button"
          data-testid="zoom"
          onClick={() => setZoomIn(!isZoomedIn)}
        >
          {isZoomedIn ? 'Zoom out' : 'Zoom in'}
        </button>
      )}
      {picture && (
        <a
          href={`${picture.current?.toDataURL('image/png')}`}
          download="ascii.png"
          className="result__download button icon-arrow-down"
        >
          Download
        </a>
      )}
      <canvas className={canvasClasses} ref={picture} />{' '}
    </div>
  );
};
