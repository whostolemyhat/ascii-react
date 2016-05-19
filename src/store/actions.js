export const IMAGE_UPLOAD = 'IMAGE_UPLOAD';
export const IMAGE_PROCESSING = 'IMAGE_PROCESSING';
export const DATA_RECEIVED = 'DATA_RECEIVED';
export const IMAGE_COMPLETE = 'IMAGE_COMPLETE';
export const RESET = 'RESET';

export const VisibilityState = {
  UPLOAD: 'UPLOAD',
  PROGRESS: 'PROGRESS',
  RESULT: 'RESULT'
};

// actions
export function imageUpload () {
  return {
    type: IMAGE_UPLOAD,
    visible: VisibilityState.PROGRESS
  };
}

export function imageProcessing () {
  return {
    type: IMAGE_PROCESSING,
    visible: VisibilityState.PROGRESS
  };
}

export function dataReceived (data) {
  return {
    type: DATA_RECEIVED,
    percentComplete: data
  };
}

export function imageComplete (data) {
  return {
    type: IMAGE_COMPLETE,
    output: data,
    visible: VisibilityState.RESULT
  };
}

export function reset () {
  return {
    type: RESET
  };
}

// reducers
const initialState = {
  visible: VisibilityState.UPLOAD,
  percentComplete: 0,
  output: ''
};

export default function asciiApp (state = initialState, action) {
  switch (action.type) {
  case IMAGE_UPLOAD:
    return Object.assign({}, state, {
      visible: action.visible
    });

  case IMAGE_PROCESSING:
    return Object.assign({}, state, {
      visible: action.visible
    });

  case DATA_RECEIVED:
    return Object.assign({}, state, {
      percentComplete: action.percentComplete
    });

  case IMAGE_COMPLETE:
    return Object.assign({}, state, {
      percentComplete: 100,
      output: action.output,
      visible: action.visible
    });

  case RESET:
    return Object.assign({}, state, initialState);

  default:
    return state;
  }
}
