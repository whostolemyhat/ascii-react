import { AsciiWorker, pixelToChar, charMap } from 'services/asciiWorker';
import sinon from 'sinon';

describe('(service) AsciiWorker', () => {
  it('should have a character map', () => {
    expect(charMap).to.be.an('array');
  });

  it('should convert a pixel to the relevant character', () => {
    const char = pixelToChar({
      r: 120,
      b: 200,
      g: 12
    }, charMap.length);

    expect(char).to.equal(5);
  });

  it('should send a message', () => {
    window.postMessage = sinon.spy();
    AsciiWorker.onmessage({
      data: [{
        data: [120, 200, 12], width: 10, height: 10
      }]
    });

    expect(postMessage).to.have.been.calledWith({ type: 'result', value: ';' });
  });
});
