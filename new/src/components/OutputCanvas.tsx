import { useEffect, useRef } from 'react';

function drawImage(
  canvas: HTMLCanvasElement,
  text: string,
  imgDimensions: { width: number; height: number },
) {
  const space = 4;
  console.log('drawing result', imgDimensions);
  const context = canvas.getContext('2d');
  canvas.height = imgDimensions.height * space;
  canvas.width = imgDimensions.width * space;

  if (context) {
    context.fillStyle = 'blue';
    context.fillRect(0, 0, canvas.width * space, canvas.height * space);
    context.fillStyle = 'black';
    context.font = '6px serif';
    let x = 0;
    let y = 0;
    for (let i = 0; i < text.length; i++) {
      if (i < imgDimensions.width) {
        console.log('drawing', text[i], x * space, y * space);
      }
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
  const picture = useRef(null);

  useEffect(() => {
    if (picture.current) {
      drawImage(picture.current, result, imgDimensions);
    }
  }, [picture.current, result]);

  return (
    <div className="result">
      <canvas ref={picture} />{' '}
      <button data-testid="reset" onClick={reset}>
        Restart
      </button>
    </div>
  );
};
