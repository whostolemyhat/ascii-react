import React from 'react';
import core from 'services/core';

export default class Result extends React.Component {
    constructor() {
        super();

        core.ascii.on('result', this.showResult.bind(this));
        this.state = {
            result: ''
        };
    }


    showResult(result) {
        this.setState({ result });
    }

    render() {
        return (
            <pre className="result">
                <code>
                    { this.state.result }
                </code>
            </pre>
        );
    };
}