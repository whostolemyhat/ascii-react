import EventEmitter from 'eventemitter3';
import { IConverter } from './IConverter';
import { ConversionOptions } from './types';

export default class AsciiConverter extends EventEmitter implements IConverter {
  worker: Worker;

  constructor() {
    super();
    this.worker = new Worker(new URL('./asciiWorker.js', import.meta.url));
    console.log('created ascii worker');
  }

  toAscii(pixels: ImageData, options: ConversionOptions) {
    console.log('using single worker');

    this.worker.postMessage([pixels, options]);
    this.worker.onmessage = (e: any) => {
      if (e.data.type === 'progress') {
        this.emit('progress', e.data.value);
      }

      if (e.data.type === 'result') {
        this.emit('result', e.data.value);
      }
    };
  }
}
