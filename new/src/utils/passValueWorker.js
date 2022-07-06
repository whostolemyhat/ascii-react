export function pixelToChar(pixel, mapLength) {
  const averageShade = Math.floor(
    pixel.r * 0.3 + pixel.b * 0.3 + pixel.g * 0.3,
  );
  return Math.floor((255 - averageShade) * (mapLength / 256));
}

export const charMap = ['.', ',', ':', ';', 'o', 'x', '%', '#', '@'];

self.onmessage = function (e) {
  console.log('[worker] starting', e.data[0]);
  const imgWidth = e.data[1];
  const imgHeight = e.data[2];

  // pull data out of shared memory
  // const pixels = new Uint8ClampedArray(e.data[0]);
  const pixels = e.data[0];

  const PIXEL_LENGTH = 4;
  let out = '';
  let col = 0;
  const rowPercent = 100 / imgHeight;
  let rowsCompleted = 0;

  for (let j = 0; j < pixels.length; j += PIXEL_LENGTH) {
    const pixel = {};
    pixel.r = pixels[j];
    pixel.g = pixels[j + 1];
    pixel.b = pixels[j + 2];
    pixel.a = pixels[j + 3];

    let char = charMap[pixelToChar(pixel, charMap.length)];
    out += char;
    col++;

    if (col === imgWidth) {
      out += '\n';
      col = 0;
      rowsCompleted += 1;
      postMessage({ type: 'progress', value: rowsCompleted * rowPercent });
    }
  }

  postMessage({ type: 'result', value: out });
};
