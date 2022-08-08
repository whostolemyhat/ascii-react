// http://www.smartjava.org/content/html5-easily-parallelize-jobs-using-web-workers-and-threadpool
import EventEmitter from 'eventemitter3';
import { IConverter } from './IConverter';
import { chunk } from './chunk';
import { ConversionOptions } from './types';

class WorkerThread {
  task?: Task;
  worker?: Worker;
  parentPool: Pool;

  constructor(parent: Pool) {
    this.parentPool = parent;
    // this.task = {};
  }

  run(task: Task) {
    this.task = task;
    // create worker
    this.worker = new Worker(new URL('./poolWorker.js', import.meta.url));
    this.worker.onmessage = this.receiveCallback.bind(this);

    // start worker
    this.worker.postMessage(this.task.data);
  }

  receiveCallback(e: { data: { index: number; value: string } }) {
    // worker destroys itself after posting message
    this.task?.callback(e);
    this.parentPool.freeWorkerThread(this);
  }
}

class Pool {
  poolSize: number;
  workerQueue: Array<WorkerThread>;
  taskQueue: Array<Task>;

  constructor(size: number) {
    this.poolSize = size;
    this.workerQueue = [];
    this.taskQueue = [];

    for (let i = 0; i < this.poolSize; i++) {
      this.workerQueue.push(new WorkerThread(this));
    }
  }

  freeWorkerThread(thread: WorkerThread) {
    if (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      if (task) {
        thread.run(task);
      }
    } else {
      this.workerQueue.push(thread);
    }
  }

  addWorkerTask(task: Task) {
    if (this.workerQueue.length > 0) {
      const thread = this.workerQueue.shift();
      thread?.run(task);
    } else {
      this.taskQueue.push(task);
    }
  }
}

export default class PoolConverter extends EventEmitter implements IConverter {
  worker: Worker;
  output: string[];
  finished: number;
  totalTasks: number;

  constructor() {
    super();
    this.worker = new Worker(new URL('./poolWorker.js', import.meta.url));
    this.finished = 0;
    this.output = [];
    this.totalTasks = 0;
    console.log('created pool worker');
  }

  toAscii(pixels: ImageData, options: ConversionOptions) {
    console.log('using multi worker', options.numWorkers);
    this.output = [];
    this.finished = 0;

    const PIXEL_LENGTH = 4;
    const imgWidth = pixels.width * PIXEL_LENGTH;
    const data = chunk(pixels.data, imgWidth);
    const resolution =
      options.resolution > 0 ? Math.ceil(options.resolution) : 1;
    this.totalTasks = Math.floor(data.length / resolution);

    // create pool
    const pool = new Pool(options.numWorkers || 8);

    // split pixel array
    for (let i = 0; i < data.length; i += resolution) {
      const task: Task = {
        data: [data[i], options, i],
        callback: this.callback.bind(this),
      };

      pool.addWorkerTask(task);
    }
  }

  callback(e: { data: { index: number; value: string } }) {
    this.finished++;
    this.emit('progress', (this.finished / this.totalTasks) * 100);
    this.output[e.data.index] = e.data.value;
    if (this.finished >= this.totalTasks) {
      this.emit(
        'result',
        this.output.filter((row) => row && row.length).join('\r\n'),
      );
    }
  }
}

type Task = {
  data: [number[], ConversionOptions, number];
  callback: (e: { data: { index: number; value: string } }) => void;
};
