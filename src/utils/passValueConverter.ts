import { EventEmitter } from 'eventemitter3';
import { IConverter } from './IConverter';
import { ConversionOptions } from './types';

export default class PassValueConverter
  extends EventEmitter
  implements IConverter
{
  worker: Worker;

  constructor() {
    super();
    this.worker = new Worker(new URL('./passValueWorker.js', import.meta.url));
  }

  toAscii(pixels: ImageData, options: ConversionOptions) {
    console.log('using pass value worker');

    // if you press 'convert' before this finishes, then the data isn't there
    // const buffer = new SharedArrayBuffer(pixels.data.length);
    // const sharedArray = new Uint8ClampedArray(buffer);
    // for (let i = 0; i < pixels.data.length; i++) {
    // sharedArray[i] = pixels.data[i];
    // }

    // console.log('buffer', buffer);

    this.worker.onmessage = (e: any) => {
      if (e.data.type === 'progress') {
        this.emit('progress', e.data.value);
      }

      if (e.data.type === 'result') {
        console.log('sending result', e.data.value);
        this.emit('result', e.data.value);
      }
    };

    this.worker.postMessage([pixels.data, pixels.width, pixels.height]);
  }
}
