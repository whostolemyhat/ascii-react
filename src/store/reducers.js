import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import asciiApp from './actions';

export const makeRootReducer = (asyncReducers) => {
    return combineReducers({
    // Add sync reducers here
        router,
        ...asyncReducers,
        asciiApp
    });
};

export const injectReducer = (store, { key, reducer }) => {
    store.asyncReducers[key] = reducer;
    store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
