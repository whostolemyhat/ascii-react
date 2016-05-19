import React from 'react';
import ReactDOM from 'react-dom';
import core from 'services/core';
import classnames from 'classnames';

export default class UploadForm extends React.Component {
    static propTypes = {
        handleImageUpload: React.PropTypes.func.isRequired,
        handleImageProcessing: React.PropTypes.func.isRequired
    };

    state = {
        preview: null,
        dragEnter: false,
        allowedTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png'
        ]
    };

    onClick = () => {
        // use file upload
        const input = this.refs.input;
        input.value = null;
        input.click();
    }

    onDragEnter = e => {
        e.preventDefault();
        this.setState({ dragEnter: true });
    }

    onDragOver = e => {
        e.preventDefault();
    }

    onDragLeave = e => {
        e.preventDefault();
    }

    onDrop = e => {
        e.preventDefault();
        this.setState({ dragEnter: false });

        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

        // check only one
        let file = files[0];

        if (this.state.allowedTypes.indexOf(file.type) > -1) {
            this.setState({ preview: window.URL.createObjectURL(file) });

            const canvas = ReactDOM.findDOMNode(this.refs.photo);
            let image = new Image();

            // note case!
            image.onload = () => { this.renderImage(canvas, image); };
            image.src = window.URL.createObjectURL(file);

            this.props.handleImageUpload();
            this.setState({ image });
        }
    }

    renderImage = (canvas, image) => {
        // resize canvas to image
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);

        // todo: this should be an action
        this.props.handleImageProcessing();
        core.ascii.toAscii(context.getImageData(0, 0, canvas.width, canvas.height));
    }

    render () {
        console.log(this.props, this.state);

        const classes = classnames({
            'upload': true,
            'upload--drag-enter': this.state.dragEnter,
            'upload--has-file': this.state.preview
        });

        return (
            <div
                className={classes}
                onClick={ this.onClick }
                onDrop={this.onDrop}
                onDragEnter={this.onDragEnter}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}>

                { this.props.children }

                <input type='file' ref='input' onChange={this.onDrop} className='input' />
                <canvas ref='photo' className='canvas'></canvas>
            </div>
        );
    }
}
