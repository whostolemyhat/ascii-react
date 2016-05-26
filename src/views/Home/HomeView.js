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
      <li><strike>adjustable font-size</strike></li>
      <li><strike>allow resolution</strike></li>
      <li><strike>Inverse</strike></li>
      <li>use whitespace</li>
      <li>colours</li>
      <li>error handling - eg not correct type, too large</li>
      <li>info bar</li>
      <li>run on server</li>
      <li><strike>save result</strike></li>
      <li>enter own characters</li>
      <li>save as pic</li>
      <li>file size</li>
      <li>routes</li>
      <li>prod server</li>
    </ul>
  </div>
);

export default HomeView;
