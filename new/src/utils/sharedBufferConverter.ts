import { EventEmitter } from 'eventemitter3';
import { IConverter } from './IConverter';
import { Options } from './types';

export default class SharedBufferConverter
  extends EventEmitter
  implements IConverter
{
  worker: Worker;
  // output: string[];
  // finished: number;
  // totalTasks: number;

  constructor() {
    super();
    this.worker = new Worker(
      new URL('./sharedBufferWorker.js', import.meta.url),
    );
    // this.finished = 0;
    // this.output = [];
    // this.totalTasks = 0;
    console.log('created sharedbuffer worker');
  }

  toAscii(pixels: ImageData, options: Options) {
    console.log('using sharedbuffer worker');
    // this.output = [];
    // this.finished = 0;
    // console.log('pixels', pixels);

    // const PIXEL_LENGTH = 4;
    // const imgWidth = pixels.width * PIXEL_LENGTH;

    // if you press 'convert' before this finishes, then the data isn't there
    console.log('creating buffer', pixels.data.length);
    const buffer = new SharedArrayBuffer(pixels.data.length);
    const sharedArray = new Uint8ClampedArray(buffer);
    for (let i = 0; i < pixels.data.length; i++) {
      sharedArray[i] = pixels.data[i];
    }

    this.worker.onmessage = (e: any) => {
      // console.log('message!', e.data.type);
      if (e.data.type === 'progress') {
        this.emit('progress', e.data.value);
      }

      if (e.data.type === 'result') {
        console.log('sending result');
        this.emit('result', e.data.value);
      }
    };

    this.worker.postMessage([buffer, options, pixels.width, pixels.height]);
  }
}
