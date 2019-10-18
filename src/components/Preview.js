import React from 'react';
import PropTypes from 'prop-types';

const Preview = ({ src }) => (
  <img src={src} className='preview' />
);

Preview.propTypes = {
  src: PropTypes.string
};

export default Preview;
