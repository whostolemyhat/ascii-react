import AsciiConverter from './asciiConverter';
import EventEmitter from 'eventemitter3';

class Core extends EventEmitter {
	constructor() {
		super();
		this.ascii = new AsciiConverter();
		this.img = '';
	}

	getImage() {
		return this.image;
	}

	setImage(src) {
		this.img = src;
		this.emit('imageChanged', this.img);
	}
}

export default new Core();