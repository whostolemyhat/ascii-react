import EventEmitter from 'eventemitter3';

export default class AsciiConverter extends EventEmitter {
    constructor() {
        super();

        this.charMap = [".", ",", ":", ";", "o", "x", "%", "#", "@"];
    }

    pixelToChar(pixel, mapLength) {
        const averageShade = Math.floor(pixel.r * 0.3 + pixel.b * 0.3 + pixel.g * 0.3);
        return Math.floor((255 - averageShade) * (mapLength / 256));
    }

    toAscii(pixels) {
        const Worker = require('worker-loader!./asciiWorker');
        const worker = new Worker;

        worker.postMessage([pixels]);
        worker.onmessage = e => {
            console.log('Message from worker');
            console.log(e);

            if(e.data.type === 'progress') {
                this.emit('progress', e.data.value);
            }

            if(e.data.type === 'result') {
                this.emit('result', e.data.value);
            }
        }
    }
}