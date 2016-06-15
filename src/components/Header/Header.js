import React from 'react';
import { IndexLink, Link } from 'react-router';

export const Header = () => (
  <header className='header'>
    <h1>asciiPicture</h1>

    <p className='header__description'>
      Convert pictures and photos into text or HTML.
    </p>

    <IndexLink to='/' activeClassName='nav--active'>
      Upload
    </IndexLink>
    { ' · ' }
    <Link to='/todo' activeClassName='nav--active'>
      Todo
    </Link>
  </header>
);

export default Header;
