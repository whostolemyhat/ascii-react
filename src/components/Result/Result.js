import React from 'react';
import PropTypes from 'prop-types';

export default class Result extends React.Component {
  static propTypes = {
    output: PropTypes.string,
    size: PropTypes.number,
    options: PropTypes.object
  }

  toHTML () {
    // TODO: escape html
    return {
      __html: this.props.output
    };
  }

  render () {
    return (
      <div className='results'>
      {this.props.options.colour
        ? <pre className='result'
          style={{fontSize: this.props.size + 'px'}}
          dangerouslySetInnerHTML={this.toHTML()}></pre>

        : <pre className='result'
          style={{fontSize: this.props.size + 'px'}}>
            <code>{this.props.output}</code>
          </pre>
      }
      </div>
    );
  }
}
