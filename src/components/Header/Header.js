import React from 'react';
import { IndexLink, Link } from 'react-router';
import classes from './Header.scss';

export const Header = () => (
  <div className='header'>
    <h1>Ascii</h1>
    <IndexLink to='/' activeClassName={classes.activeRoute}>
      Home
    </IndexLink>
    {' · '}
    <Link to='/upload' activeClassName={classes.activeRoute}>
      Upload
    </Link>
  </div>
);

export default Header;
