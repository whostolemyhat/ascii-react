// http://www.smartjava.org/content/html5-easily-parallelize-jobs-using-web-workers-and-threadpool
import EventEmitter from 'eventemitter3';
import Worker from 'worker-loader!./poolWorker';

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

export default class PoolConverter extends EventEmitter {
  toAscii (pixels, options) {
    this.output = '';
    this.finished = 0;

    const PIXEL_LENGTH = 4;
    const imgWidth = (pixels.width * PIXEL_LENGTH);
    // const rowPercent = 100 / pixels.height;
    const data = chunk(pixels.data, imgWidth);
    // const dataLength = data.length;
    const resolution = options.resolution > 0 ? Math.ceil(options.resolution) : 1;
    this.totalTasks = Math.floor(data.length / resolution);

    console.log('data', data); // tasks
    // create pool
    const pool = new Pool(4);

    // split pixel array (if needed) and label

    for (let i = 0; i < data.length; i += resolution) {
      const task = {
        data: [data[i], options],
        callback: this.callback.bind(this)
      };

      pool.addWorkerTask(task);
    }
  }

  callback (e) {
    console.log('worker', e);
    this.finished++;
    console.log(this.finished, this.totalTasks);
    this.emit('progress', (this.finished / this.totalTasks) * 100);
    this.output += e.data.value + '\r\n';
    if (this.finished >= this.totalTasks) {
      this.emit('result', this.output);
    }
  }
}

class Pool {
  constructor (size) {
    this.poolSize = size;
    this.workerQueue = [];
    this.taskQueue = [];

    for (let i = 0; i < this.poolSize; i++) {
      this.workerQueue.push(new WorkerThread(this, this.callback));
    }
  }

  freeWorkerThread (thread) {
    if (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      thread.run(task);
    } else {
      this.workerQueue.push(thread);
    }
  }

  addWorkerTask (task) {
    if (this.workerQueue.length > 0) {
      const thread = this.workerQueue.shift();
      thread.run(task);
    } else {
      this.taskQueue.push(task);
    }
  }

}

class WorkerThread {
  constructor (parent) {
    this.parentPool = parent;
    this.task = {};
  }

  run (task) {
    this.task = task;
    // create worker
    const worker = new Worker();
    worker.onmessage = this.receiveCallback.bind(this);

    // start worker
    worker.postMessage(this.task.data);
  }

  receiveCallback (e) {
    this.task.callback(e);
    this.parentPool.freeWorkerThread(this);
  }
}
