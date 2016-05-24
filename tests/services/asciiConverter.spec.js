import EventEmitter from 'eventemitter3';

describe('(service) AsciiConverter', () => {
  let ascii, Ascii, workerStub, postMessageStub;

  beforeEach(() => {
    postMessageStub = sinon.spy();

    class Worker extends EventEmitter {
      postMessage = postMessageStub;
    }
    workerStub = Worker;

    let inject = require('inject!services/asciiConverter');
    Ascii = inject({
      'worker-loader!./asciiWorker': workerStub
    }).default;

    ascii = new Ascii();
  });

  it('should have .toAscii method', () => {
    expect(ascii.toAscii).to.be.a('function');
  });

  it('should send data to worker', () => {
    ascii.toAscii('hello');

    expect(postMessageStub).to.have.been.calledWith(['hello']);
  });

  describe('onmessage', () => {
    it('should handle progress events from worker', () => {
      ascii.emit = sinon.spy();
      ascii.toAscii('hello');

      ascii.worker.onmessage({
        data: {
          type: 'progress',
          value: 'hello'
        }
      });

      expect(ascii.emit).to.have.been.calledWith('progress', 'hello');
    });

    it('should handle result events from worker', () => {
      ascii.emit = sinon.spy();
      ascii.toAscii('hello');

      ascii.worker.onmessage({
        data: {
          type: 'result',
          value: 'world'
        }
      });

      expect(ascii.emit).to.have.been.calledWith('result', 'world');
    });
  });
});
