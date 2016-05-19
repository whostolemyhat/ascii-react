
describe('(service) AsciiConverter', () => {
  let Ascii, workerStub, postMessage;

  beforeEach(() => {
    postMessage = sinon.spy();

    workerStub = () => ({
      postMessage
    });

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

    expect(postMessage).to.have.been.calledWith( ['hello'] );
  });
});
