import EventEmitter from 'eventemitter3';
import Worker from 'worker-loader!./asciiWorker';

export default class AsciiConverter extends EventEmitter {
  toAscii (pixels, options) {
    this.worker = new Worker();

    this.worker.postMessage([pixels, options]);
    this.worker.onmessage = e => {
      if (e.data.type === 'progress') {
        this.emit('progress', parseFloat(e.data.value).toFixed(0));
      }

      if (e.data.type === 'result') {
        this.emit('result', e.data.value);
      }
    };
  }
}
