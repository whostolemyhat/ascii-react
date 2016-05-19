import React from 'react';
import core from 'services/core';

export default class Progress extends React.Component {
    constructor () {
        super();

        this.state = {
            progress: 0,
            img: null
        };

        // TODO: hmm
        // core.ascii.on('progress', this.updateProgress.bind(this));
        // core.on('imageChanged', this.updateImg.bind(this));
    }

    updateImg (src) {
        this.setState({ img: src });
        this.renderPreview();
    }

    renderPreview () {
        if (this.state.img) {
            return (
                <img className='preview' src={this.state.img} />
            );
        }
    }

    // updateProgress (progress) {
    //     this.setState({ progress: progress });
    // }

    renderProgress () {
        if (this.props.percentComplete) {
            return <progress
                        className='progress__bar'
                        value={this.props.percentComplete}
                        max='100' />;
        }
    }

    render () {
        console.log('hello I\'m the progress bar', this.props);
        return (
            <div className='progress'>
                {this.renderPreview()}
                {this.renderProgress()}
            </div>
        );
    };
}
