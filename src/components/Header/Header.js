import React from 'react';
import { IndexLink, Link } from 'react-router';
import classes from './Header.scss';

export const Header = () => (
  <header className='header'>
    <h1>AsciiPicture</h1>

    <p className='header__description'>
      Convert pictures and photos into text or HTML.
    </p>

    <IndexLink to='/' activeClassName={classes.activeRoute}>
      Upload
    </IndexLink>
    {' · '}
    <Link to='/todo' activeClassName={classes.activeRoute}>
      Todo
    </Link>
  </header>
);

export default Header;
