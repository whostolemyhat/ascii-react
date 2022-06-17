export function pixelToChar(pixel, mapLength) {
  const averageShade = Math.floor(
    pixel.r * 0.3 + pixel.b * 0.3 + pixel.g * 0.3,
  );
  return Math.floor((255 - averageShade) * (mapLength / 256));
}

export const charMap = ['.', ',', ':', ';', 'o', 'x', '%', '#', '@'];

self.onmessage = function (e) {
  console.log('[worker] starting', e.data[0]);

  // eslint-disable-line no-undef
  const options = e.data[1];
  const rowNumber = e.data[2];
  const startAt = e.data[3];
  const imgWidth = e.data[4];

  // pull data out of shared memory
  const pixels = new Uint8ClampedArray(e.data[0]);

  // const sharedArray = new Uint8ClampedArray(e.data[0]);
  console.log(pixels);

  const resolution = options.resolution > 0 ? Math.ceil(options.resolution) : 1;

  if (options.whitespace === 'spaces') {
    charMap[0] = ' ';
  }

  if (options.invert) {
    // Note: works in-place!
    charMap.reverse();
  }

  const PIXEL_LENGTH = 4;
  let out = '';

  for (let j = 0; j < imgWidth; j += PIXEL_LENGTH * resolution) {
    const pixel = {};
    pixel.r = pixels[j];
    pixel.g = pixels[j + 1];
    pixel.b = pixels[j + 2];
    pixel.a = pixels[j + 3];

    let char = charMap[pixelToChar(pixel, charMap.length)];
    if (options.colour) {
      char =
        `<span style="color:rgb(${pixel.r}, ${pixel.g}, ${pixel.b})">` +
        char +
        '</span>';
    }
    out += char;
  }

  console.log('[worker] finished', out);
  postMessage({ type: 'result', value: out, rowNumber });
  self.close();
};

// export { self as AsciiWorker };
