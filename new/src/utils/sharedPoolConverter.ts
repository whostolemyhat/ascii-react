import { EventEmitter } from 'eventemitter3';
import { IConverter } from './IConverter';
import { Options } from './types';

const PIXEL_LENGTH = 4;

export default class SharedBufferConverter
  extends EventEmitter
  implements IConverter
{
  workers: Worker[];
  result: string;
  resultCount: number;

  constructor() {
    super();
    this.workers = [
      new Worker(new URL('./sharedBufferWorker.js', import.meta.url)),
      new Worker(new URL('./sharedBufferWorker.js', import.meta.url)),
    ];
    this.result = '';
    this.resultCount = 0;
  }

  toAscii(pixels: ImageData, options: Options) {
    console.log('using sharedpoolbuffer worker');

    const totalWorkers = this.workers.length;

    // if you press 'convert' before this finishes, then the data isn't there
    const buffer = new SharedArrayBuffer(pixels.data.length);
    const sharedArray = new Uint8ClampedArray(buffer);
    for (let i = 0; i < pixels.data.length; i++) {
      sharedArray[i] = pixels.data[i];
    }

    this.workers.forEach((worker, i) => {
      console.log('starting workers', worker, i);
      worker.onmessage = (e: any) => {
        if (e.data.type === 'progress') {
          this.emit('progress', e.data.value);
        }

        if (e.data.type === 'result') {
          // tODO order
          this.result += e.data.value;
          this.resultCount += 1;
          if (this.resultCount === this.workers.length) {
            this.emit('result', this.result);
          }
        }
      };

      const totalPixels = sharedArray.length / PIXEL_LENGTH;
      console.log('pix', totalPixels);

      const chunkLength = totalPixels / this.workers.length;
      console.log(
        'chunk',
        chunkLength,
        'start',
        i * chunkLength * PIXEL_LENGTH,
        'end',
        (i + 1) * chunkLength * PIXEL_LENGTH,
      );

      // TODO split array
      worker.postMessage([
        sharedArray,
        pixels.width,
        pixels.height,
        i * chunkLength * PIXEL_LENGTH, // start
        (i + 1) * chunkLength * PIXEL_LENGTH, // end
      ]);
    });
  }
}
