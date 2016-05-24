import React from 'react';
import DuckImage from './assets/Duck.jpg';

export const HomeView = () => (
  <div>
    <h4>TODO</h4>
    <img
      alt='This is a duck, because Redux!'
      src={DuckImage} />

    <ul>
        <li><strike>remove core</strike></li>
        <li>style</li>
        <li><strike>preview component</strike></li>
        <li>adjustable font-size</li>
        <li>allow resolution</li>
        <li>Inverse</li>
        <li>use whitespace</li>
        <li>colours</li>
        <li>error handling - eg not correct type, too large</li>
        <li>run on server</li>
        <li><strike>save result</strike></li>
    </ul>
  </div>
);

export default HomeView;
