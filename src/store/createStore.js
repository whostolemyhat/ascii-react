import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import makeRootReducer from './reducers';

export default (initialState = {}, history) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, routerMiddleware(history)];

  // ======================================================
  // Store Enhancers
  // ======================================================
  // const enhancers = [];
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  // if (__DEBUG__) {
  //   const devToolsExtension = window.devToolsExtension;
  //   if (typeof devToolsExtension === 'function') {
  //     enhancers.push(devToolsExtension());
  //   }
  // }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware),
    )
  );
  store.asyncReducers = {};

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers);
    });
  }

  return store;
};
