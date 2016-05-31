// lodash chunk function
const chunk = function (array, count) {
  if (count == null || count < 1) return [];

  const result = [];
  const length = array.length;
  let i = 0;
  while (i < length) {
    result.push(Array.prototype.slice.call(array, i, i += count));
  }
  return result;
};

export function pixelToChar (pixel, mapLength) {
  const averageShade = Math.floor(pixel.r * 0.3 + pixel.b * 0.3 + pixel.g * 0.3);
  return Math.floor((255 - averageShade) * (mapLength / 256));
}

// export const charMap = ['@', '#', '%', 'x', 'o', ';', ':', ',', '.'];
export const charMap = ['.', ',', ':', ';', 'o', 'x', '%', '#', '@'];

self.onmessage = function (e) { // eslint-disable-line no-undef
  const pixels = e.data[0];
  const options = e.data[1];

  const resolution = options.resolution > 0 ? Math.ceil(options.resolution) : 1;

  if (options.whitespace === 'spaces') {
    charMap[0] = ' ';
  }

  if (options.invert) {
    // Note: works in-place!
    charMap.reverse();
  }

  // r,g,b,a
  const PIXEL_LENGTH = 4;
  const imgWidth = (pixels.width * PIXEL_LENGTH);
  const rowPercent = 100 / pixels.height;
  const data = chunk(pixels.data, imgWidth);
  const dataLength = data.length;
  let out = '';

  for (let i = 0; i < dataLength; i += resolution) {
    for (let j = 0; j < data[i].length; j += PIXEL_LENGTH * resolution) {
      const pixel = {};
      pixel.r = data[i][j];
      pixel.g = data[i][j + 1];
      pixel.b = data[i][j + 2];
      pixel.a = data[i][j + 3];

      let char = charMap[ pixelToChar(pixel, charMap.length) ];
      if (options.colour) {
        char = `<span style="color:rgb(${ pixel.r }, ${ pixel.g }, ${ pixel.b })">` +
          char + '</span>';
      }
      out += char;
    }

    out += '\r\n';
    postMessage({ type: 'progress', value: (i * rowPercent) * resolution });
  }

  postMessage({ type: 'result', value: out });
};

export { self as AsciiWorker };
