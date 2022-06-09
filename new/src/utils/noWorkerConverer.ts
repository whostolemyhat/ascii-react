import EventEmitter from 'eventemitter3';
import { Options, Pixel } from './types';

const chunk = function (array: ImageData['data'], count: number) {
  if (count == null || count < 1) return [];

  const result = [];
  const length = array.length;
  let i = 0;
  while (i < length) {
    result.push(Array.prototype.slice.call(array, i, (i += count)));
  }
  return result;
};

export function pixelToChar(pixel: Pixel, mapLength: number): number {
  const averageShade = Math.floor(
    pixel.r * 0.3 + pixel.b * 0.3 + pixel.g * 0.3,
  );
  return Math.floor((255 - averageShade) * (mapLength / 256));
}

export const charMap = ['.', ',', ':', ';', 'o', 'x', '%', '#', '@'];

export default class NoWorkerConverter extends EventEmitter {
  toAscii(pixels: ImageData, options: Options) {
    console.log('using no worker');

    const resolution =
      options.resolution > 0 ? Math.ceil(options.resolution) : 1;

    if (options.whitespace === 'spaces') {
      charMap[0] = ' ';
    }

    if (options.invert) {
      // Note: works in-place!
      charMap.reverse();
    }

    // r,g,b,a
    const PIXEL_LENGTH = 4;
    const imgWidth = pixels.width * PIXEL_LENGTH;
    const rowPercent = 100 / pixels.height;
    const data = chunk(pixels.data, imgWidth);
    const dataLength = data.length;
    let out = '';

    for (let i = 0; i < dataLength; i += resolution) {
      for (let j = 0; j < data[i].length; j += PIXEL_LENGTH * resolution) {
        const pixel: Pixel = {
          r: data[i][j],
          g: data[i][j + 1],
          b: data[i][j + 2],
          a: data[i][j + 3],
        };

        let char = charMap[pixelToChar(pixel, charMap.length)];
        if (options.colour) {
          char =
            `<span style="color:rgb(${pixel.r}, ${pixel.g}, ${pixel.b})">` +
            char +
            '</span>';
        }
        out += char;
      }

      out += '\r\n';
      this.emit('progress', i * rowPercent);
    }

    this.emit('result', out);
  }
}
