import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// import { useRouterHistory } from 'react-router';
// import createBrowserHistory from 'history/lib/createBrowserHistory';

// import AppContainer from './containers/AppContainer';

// const browserHistory = useRouterHistory(createBrowserHistory)({
//   basename: __BASENAME__
// });
import { Provider } from 'react-redux';
import store from './store';

console.log(store);

ReactDOM.render(<Provider store={ store }><App /></Provider>, document.getElementById('root'));
// ReactDOM.render(<AppContainer />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
