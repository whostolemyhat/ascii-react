import React from 'react';
import PropTypes from 'prop-types';

const Preview = ({ src }) => (
  <img src={src} className='preview' alt='' />
);

Preview.propTypes = {
  src: PropTypes.string
};

export default Preview;
