import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import rootReducer from './reducers';

// @ts-ignore
// const tokenMiddleware = store => next => action => {
//   // Get the state before and after the action was performed
//   const previousToken = store.getState().user.token;

//   // https://michaelwashburnjr.com/best-way-to-store-tokens-redux/
//   next(action);
//   const nextToken = store.getState().user.token;

//   // Respond to changes
//   if (nextToken !== previousToken) {
//     if (!nextToken) {
//       localStorage.removeItem('token');
//     } else {
//       localStorage.setItem('token', nextToken);
//     }
//   }

// };

const store = configureStore({
  reducer: rootReducer,
  // middleware: [tokenMiddleware, ...getDefaultMiddleware()]
});

export default store;
