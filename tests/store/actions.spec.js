import {
  imageUpload,
  imageProcessing,
  dataReceived,
  imageComplete,
  reset,
  initialState,
  default as asciiApp
} from 'store/actions';

describe('(store) actions', () => {
  describe('action handlers', () => {
    it('should handle image upload', () => {
      expect(imageUpload('test')).to.eql({
        type: 'IMAGE_UPLOAD',
        visible: 'PROGRESS',
        src: 'test'
      });
    });

    it('should handle image processing', () => {
      expect(imageProcessing()).to.eql({ type: 'IMAGE_PROCESSING', visible: 'PROGRESS' });
    });

    it('should handle data received', () => {
      expect(dataReceived(10)).to.eql({
        type: 'DATA_RECEIVED',
        percentComplete: 10
      });
    });

    it('should handle image complete', () => {
      expect(imageComplete('hello')).to.eql({
        type: 'IMAGE_COMPLETE',
        output: 'hello',
        visible: 'RESULT'
      });
    });

    it('should handle reset', () => {
      expect(reset()).to.eql({ type: 'RESET' });
    });
  });

  it('should set initial state', () => {
    expect(initialState).to.eql({
      visible: 'UPLOAD',
      percentComplete: 0,
      output: '',
      src: ''
    });
  });

  describe('reducers', () => {
    it('should handle upload', () => {
      const state = asciiApp(initialState, { type: 'IMAGE_UPLOAD', visible: 'hello' });
      expect(state).to.contain({ visible: 'hello' });
    });

    it('should handle processing', () => {
      const state = asciiApp(initialState, { type: 'IMAGE_PROCESSING', visible: 'world' });
      expect(state).to.contain({ visible: 'world' });
    });

    it('should handle data', () => {
      const state = asciiApp(initialState, { type: 'DATA_RECEIVED', percentComplete: 2 });
      expect(state).to.contain({ percentComplete: 2 });
    });

    it('should handle complete', () => {
      const state = asciiApp(initialState, {
        type: 'IMAGE_COMPLETE',
        visible: 'hello',
        output: 'world'
      });

      expect(state).to.contain({
        visible: 'hello',
        output: 'world',
        percentComplete: 100
      });
    });

    it('should handle reset', () => {
      const state = asciiApp(initialState, { type: 'RESET' });
      expect(state).to.eql(initialState);
    });

    it('should handle default', () => {
      const state = asciiApp(initialState, { type: 'safafsf' });
      expect(state).to.eql(initialState);
    });
  });
});
