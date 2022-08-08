import { EventEmitter } from 'eventemitter3';
import { IConverter } from './IConverter';
import { ConversionOptions } from './types';

const PIXEL_LENGTH = 4;

export default class SharedBufferConverter
  extends EventEmitter
  implements IConverter
{
  workers: Worker[];
  result: string[];
  resultCount: number;

  constructor() {
    super();
    this.workers = [
      new Worker(new URL('./sharedBufferWorker.js', import.meta.url)),
      new Worker(new URL('./sharedBufferWorker.js', import.meta.url)),
      new Worker(new URL('./sharedBufferWorker.js', import.meta.url)),
    ];
    this.result = [];
    this.resultCount = 0;
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  toAscii(pixels: ImageData, _options: ConversionOptions) {
    const totalWorkers = this.workers.length;
    console.log(`using sharedpoolbuffer worker; using ${totalWorkers} workers`);

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
          const pos = e.data.position;
          this.result[pos] = e.data.value;
          this.resultCount += 1;
          if (this.resultCount === totalWorkers) {
            this.emit('result', this.result.join());
          }
        }
      };

      // lower bound - if divide isn't even then take floor,
      // last worker needs to go up to the end
      const rowChunk = Math.floor(pixels.height / totalWorkers);

      const start = pixels.width * i * rowChunk * PIXEL_LENGTH;
      let end = pixels.width * (i + 1) * rowChunk * PIXEL_LENGTH;
      if (i === totalWorkers - 1) {
        end = pixels.data.length;
      }

      worker.postMessage([
        sharedArray,
        pixels.width,
        pixels.height,
        start,
        end,
        i,
      ]);
    });
  }
}
