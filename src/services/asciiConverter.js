import EventEmitter from 'eventemitter3';
import Worker from 'worker-loader!./asciiWorker';

export default class AsciiConverter extends EventEmitter {
  toAscii (pixels) {
    this.worker = new Worker();

    this.worker.postMessage([pixels]);
    this.worker.onmessage = e => {
      if (e.data.type === 'progress') {
        this.emit('progress', e.data.value);
      }

      if (e.data.type === 'result') {
        this.emit('result', e.data.value);
      }
    };
  }
}
