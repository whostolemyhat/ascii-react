import React from 'react';

const Result = ({ output, size }) => (
  <pre className='result' style={{fontSize: size + 'px'}}><code>{output}</code></pre>
);

Result.propTypes = {
  output: React.PropTypes.string,
  size: React.PropTypes.number
};

export default Result;
