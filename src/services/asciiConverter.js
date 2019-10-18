import EventEmitter from 'eventemitter3';
// eslint-disable-next-line
import Worker from 'worker-loader!./ascii.worker';

export default class AsciiConverter extends EventEmitter {
  toAscii (pixels, options) {
    console.log('using single worker');
    this.worker = new Worker();

    this.worker.postMessage([pixels, options]);
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
