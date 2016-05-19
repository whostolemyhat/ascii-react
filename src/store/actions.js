export const IMAGE_UPLOAD = 'IMAGE_UPLOAD';
export const IMAGE_PROCESSING = 'IMAGE_PROCESSING';
export const DATA_RECEIVED = 'DATA_RECEIVED';
export const IMAGE_COMPLETE = 'IMAGE_COMPLETE';

export const VisibilityState = {
    UPLOAD: 'UPLOAD',
    PROGRESS: 'PROGRESS',
    RESULT: 'RESULT'
};

// actions
export function imageUpload (image) {
    console.log('image upload', image);

    return {
        type: IMAGE_UPLOAD,
        image,
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
    console.log('dataReceived', data);

    return {
        type: DATA_RECEIVED,
        percentComplete: data
    };
}

export function imageComplete (data) {
    console.log('COMPLETE', data);
    return {
        type: IMAGE_COMPLETE,
        output: data,
        visible: VisibilityState.RESULT
    };
}

// const boundImageUpload = img => dispatch(imageUpload(img));

// reducers
const initialState = {
    image: '',
    visible: VisibilityState.UPLOAD,
    percentComplete: 0,
    output: ''
};

export default function asciiApp (state = initialState, action) {
    switch (action.type) {
    case IMAGE_UPLOAD:
        console.log('image upload case', action);

        return Object.assign({}, state, {
            visible: action.visible
        });

    case IMAGE_PROCESSING:
        console.log('image processing', action);
        return Object.assign({}, state, {
            visible: action.visible
        });

    case DATA_RECEIVED:
        console.log('data recevived', action);
        return Object.assign({}, state, {
            percentComplete: action.percentComplete
        });

    case IMAGE_COMPLETE:
        console.log('image complete', action);
        return Object.assign({}, state, {
            percentComplete: 100,
            output: action.output,
            visible: action.visible
        });

    default:
        return state;
    }
}
