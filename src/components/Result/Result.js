import React from 'react';

export default class Result extends React.Component {
  static propTypes = {
    output: React.PropTypes.string,
    size: React.PropTypes.number,
    options: React.PropTypes.object
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
        ? <pre className='result' style={{fontSize: this.props.size + 'px'}} dangerouslySetInnerHTML={this.toHTML()}></pre>
        : <pre className='result' style={{fontSize: this.props.size + 'px'}}><code>{this.props.output}</code></pre>
      }
      </div>
    );
  }
}
