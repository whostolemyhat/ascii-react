import React from 'react';
import { connect } from 'react-redux';

import core from 'services/core';
import UploadForm from 'components/UploadForm/UploadForm';
import Progress from 'components/Progress/Progress';
import Result from 'components/Result/Result';

import {
    imageUpload,
    imageProcessing,
    dataReceived,
    imageComplete,
    reset
} from 'store/actions';

class UploadFormView extends React.Component {
    static propTypes = {
        handleImageUpload: React.PropTypes.func.isRequired,
        handleImageProcessing: React.PropTypes.func.isRequired,
        handleDataReceived: React.PropTypes.func.isRequired,
        handleImageComplete: React.PropTypes.func.isRequired,
        handleReset: React.PropTypes.func.isRequired,
        visible: React.PropTypes.string,
        percentComplete: React.PropTypes.number,
        output: React.PropTypes.string
    }

    componentWillMount () {
        core.ascii.on('progress', data => this.props.handleDataReceived(data));
        core.ascii.on('result', this.props.handleImageComplete);

        // TODO: this sets image preview
        // core.on('imageChanged', this.props.handleImageComplete);
    }

    handleResetClick = e => {
        e.preventDefault();
        this.props.handleReset();
    }

    render () {
        return (
            <div>
                { this.props.visible === 'UPLOAD'
                    ? <UploadForm
                        handleImageUpload={ this.props.handleImageUpload }
                        handleImageProcessing={ this.props.handleImageProcessing }>
                        Drop an image here, or click to pick</UploadForm>
                    : null }
                { this.props.visible === 'PROGRESS'
                    ? <Progress
                        percentComplete={ this.props.percentComplete } />
                    : null }
                { this.props.visible === 'RESULT'
                    ? <div><a href='#' onClick={ this.handleResetClick }>Another</a>
                        <Result
                        output={ this.props.output } /></div>
                    : null }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    console.log('mapStateToProps', state);

    return {
        visible: state.asciiApp.visible,
        percentComplete: state.asciiApp.percentComplete,
        output: state.asciiApp.output
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    console.log('own', ownProps);

    return {
        handleImageUpload: () => {
            dispatch(imageUpload());
        },

        handleImageProcessing: () => {
            dispatch(imageProcessing());
        },

        handleDataReceived: data => {
            dispatch(dataReceived(data));
        },

        handleImageComplete: data => {
            dispatch(imageComplete(data));
        },

        handleReset: () => {
            dispatch(reset());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadFormView);
