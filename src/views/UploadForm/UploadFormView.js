import React from 'react';
import { connect } from 'react-redux';

import UploadForm from 'components/UploadForm/UploadForm';
import Progress from 'components/Progress/Progress';
import Result from 'components/Result/Result';

import { imageUpload } from 'store/actions';

const UploadFormView = ({ handleImageUpload, visible }) => (
    <div>
        { visible === 'PROGRESS' ? console.log('yep') : console.log('nope') }
        <UploadForm
            visible={ visible }
            handleImageUpload={ handleImageUpload }>
            Drop an image here, or click to pick</UploadForm>
        <Progress />
        <Result />
    </div>
);

UploadFormView.propTypes = {
    handleImageUpload: React.PropTypes.func.isRequired,
    visible: React.PropTypes.string
};

const mapStateToProps = (state) => {
    console.log('mapStateToProps', state);

    return {
        visible: state.asciiApp.visible
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    console.log('own', ownProps);

    return {
        handleImageUpload: (img) => {
            dispatch(imageUpload(img));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadFormView);
