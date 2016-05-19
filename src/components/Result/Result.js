import React from 'react';

const Result = ({ output }) => (
    <pre className='result'><code>{output}</code></pre>
);

Result.propTypes = {
  output: React.PropTypes.string
};

export default Result;
