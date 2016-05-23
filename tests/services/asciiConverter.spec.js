import EventEmitter from 'eventemitter3';

describe('(service) AsciiConverter', () => {
  let Ascii, workerStub, postMessageStub;

  beforeEach(() => {
    postMessageStub = sinon.spy();

    class Worker extends EventEmitter {
      postMessage = postMessageStub;
      emit = EventEmitter.emit;
    }
    workerStub = Worker;

    let inject = require('inject!services/AsciiConverter');
    Ascii = inject({
      'worker-loader!./asciiWorker': workerStub
    }).default;
  });

  it('should have .toAscii method', () => {
    expect(new Ascii().toAscii).to.be.a('function');
  });

  it('should send data to worker', () => {
    const ascii = new Ascii();
    ascii.toAscii('hello');

    expect(postMessageStub).to.have.been.calledWith(['hello']);
  });

  // need to somehow send a message from the worker that converter owns
  // it('should handle progress events from worker', done => {
  //   const ascii = new Ascii();
  //   ascii.toAscii('hello');
  //   console.log('ascii', ascii.on, workerStub.emit);
  //   // document.addEventListener(ascii, 'progress', done);
  //   ascii.on('progress', done);

  //   workerStub.emit('message', { data: { type: 'progress', value: 'test' }});
  // });

  // it('should handle result events from worker');
});
