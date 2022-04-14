export function pixelToChar (pixel, mapLength) {
  const averageShade = Math.floor(pixel.r * 0.3 + pixel.b * 0.3 + pixel.g * 0.3);
  return Math.floor((255 - averageShade) * (mapLength / 256));
}

export const charMap = ['.', ',', ':', ';', 'o', 'x', '%', '#', '@'];

self.onmessage = function (e) { // eslint-disable-line no-undef
  const pixels = e.data[0];
  const options = e.data[1];
  const index = e.data[2];

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

  for (let j = 0; j < pixels.length; j += PIXEL_LENGTH * resolution) {
    const pixel = {};
    pixel.r = pixels[j];
    pixel.g = pixels[j + 1];
    pixel.b = pixels[j + 2];
    pixel.a = pixels[j + 3];

    let char = charMap[ pixelToChar(pixel, charMap.length) ];
    if (options.colour) {
      char = `<span style="color:rgb(${ pixel.r }, ${ pixel.g }, ${ pixel.b })">` +
        char + '</span>';
    }
    out += char;
  }

  postMessage({ type: 'result', value: out, index });
  self.close();
};

export { self as AsciiWorker };
