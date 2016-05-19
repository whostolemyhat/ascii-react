import AsciiConverter from './asciiConverter';
import EventEmitter from 'eventemitter3';

class Core extends EventEmitter {
    constructor () {
        super();
        this.ascii = new AsciiConverter();
    }
}

export default new Core();
