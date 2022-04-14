// http://www.smartjava.org/content/html5-easily-parallelize-jobs-using-web-workers-and-threadpool
import EventEmitter from 'eventemitter3';
import Worker from 'worker-loader!./poolWorker';

// lodash
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
    console.log('using multi worker', options.numWorkers);
    this.output = [];
    this.finished = 0;

    const PIXEL_LENGTH = 4;
    const imgWidth = (pixels.width * PIXEL_LENGTH);
    const data = chunk(pixels.data, imgWidth);
    const resolution = options.resolution > 0 ? Math.ceil(options.resolution) : 1;
    this.totalTasks = Math.floor(data.length / resolution);

    // create pool
    const pool = new Pool(options.numWorkers || 32);

    // split pixel array
    for (let i = 0; i < data.length; i += resolution) {
      const task = {
        data: [data[i], options, i],
        callback: this.callback.bind(this)
      };

      pool.addWorkerTask(task);
    }
  }

  callback (e) {
    this.finished++;
    this.emit('progress', (this.finished / this.totalTasks) * 100);
    this.output[e.data.index] = e.data.value;
    if (this.finished >= this.totalTasks) {
      this.emit('result', this.output.filter(row => row && row.length).join('\r\n'));
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
    this.worker = new Worker();
    this.worker.onmessage = this.receiveCallback.bind(this);

    // start worker
    this.worker.postMessage(this.task.data);
  }

  receiveCallback (e) {
    // worker destroys itself after posting message
    this.task.callback(e);
    this.parentPool.freeWorkerThread(this);
  }
}
