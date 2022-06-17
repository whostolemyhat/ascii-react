import { EventEmitter } from 'eventemitter3';
import { IConverter } from './IConverter';
import { Options } from './types';

export default class SharedBufferConverter
  extends EventEmitter
  implements IConverter
{
  worker: Worker;
  output: string[];
  finished: number;
  totalTasks: number;

  constructor() {
    super();
    this.worker = new Worker(
      new URL('./sharedBufferWorker.js', import.meta.url),
    );
    this.finished = 0;
    this.output = [];
    this.totalTasks = 0;
    console.log('created sharedbuffer worker');
  }

  toAscii(pixels: ImageData, options: Options) {
    console.log('using sharedbuffer worker', options.numWorkers);
    this.output = [];
    this.finished = 0;
    console.log('pixels', pixels);

    const PIXEL_LENGTH = 4;
    const imgWidth = pixels.width * PIXEL_LENGTH;

    const buffer = new SharedArrayBuffer(pixels.data.length);
    const sharedArray = new Uint8ClampedArray(buffer);
    for (let i = 0; i < pixels.data.length; i++) {
      sharedArray[i] = pixels.data[i];
    }
    console.log(sharedArray);
    this.worker.onmessage = (e: any) => {
      this.emit('result', e.data.value);
    };

    this.worker.postMessage([buffer, options, 0, 1, pixels.width]);

    // const data = chunk(pixels.data, imgWidth);
    // const resolution =
    //   options.resolution > 0 ? Math.ceil(options.resolution) : 1;
    // this.totalTasks = Math.floor(data.length / resolution);

    // // create pool
    // const pool = new Pool(options.numWorkers || 8);

    // split pixel array
    // for (let i = 0; i < data.length; i += resolution) {
    //   const task: Task = {
    //     data: [data[i], options, i],
    //     callback: this.callback.bind(this),
    //   };

    //   pool.addWorkerTask(task);
    // }
  }

  // @ts-ignore
  callback(e: { data: { index: number; value: string } }) {
    //   this.finished++;
    this.emit('progress', (this.finished / this.totalTasks) * 100);
    this.output[e.data.index] = e.data.value;
    //   if (this.finished >= this.totalTasks) {
    console.log('[main] finished');
    this.emit(
      'result',
      this.output.filter((row) => row && row.length).join('\r\n'),
    );
    // }
  }
}
