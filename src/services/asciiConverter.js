import EventEmitter from 'eventemitter3';

export default class AsciiConverter extends EventEmitter {
  constructor () {
    super();

    this.charMap = ['.', ',', ':', ';', 'o', 'x', '%', '#', '@'];
  }

  toAscii (pixels) {
    const Worker = require('worker-loader!./asciiWorker');
    const worker = new Worker();

    worker.postMessage([pixels]);
    worker.onmessage = e => {
            // console.log(e);

      if (e.data.type === 'progress') {
        this.emit('progress', e.data.value);
      }

      if (e.data.type === 'result') {
        this.emit('result', e.data.value);
      }
    };
  }
}
