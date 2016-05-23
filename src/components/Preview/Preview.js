import React from 'react';

const Preview = ({ src }) => (
  <img src={src} className='preview' />
);

Preview.propTypes = {
  src: React.PropTypes.string
};

export default Preview;
