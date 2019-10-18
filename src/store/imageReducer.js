import { VisibilityState, IMAGE_UPLOAD, IMAGE_PROCESSING, DATA_RECEIVED, IMAGE_COMPLETE, RESET } from "./actions";

// reducers
export const initialState = {
  visible: VisibilityState.UPLOAD,
  percentComplete: 0,
  output: '',
  src: '',
  options: {
    resolution: 1,
    invert: false,
    colour: false
  }
};

export default function imageReducer(state = initialState, action) {
  switch (action.type) {
    case IMAGE_UPLOAD:
      return Object.assign({}, state, {
        visible: action.visible,
        src: action.src
      });

    case IMAGE_PROCESSING:
      return Object.assign({}, state, {
        visible: action.visible,
        options: action.options
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
