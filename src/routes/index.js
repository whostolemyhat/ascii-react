import React from 'react';
import { Route, IndexRoute } from 'react-router';

import CoreLayout from '../layouts/CoreLayout/CoreLayout';
import HomeView from 'views/Home/HomeView';
// import Counter from './Counter';
import UploadFormView from 'views/UploadForm/UploadFormView';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

// export const createRoutes = (store) => ({
//     path: '/',
//     component: CoreLayout,
//     indexRoute: Home,
//     childRoutes: [
//         CounterRoute(store),
//         UploadFormRoute(store)
//     ]
// });

export default (store) => (
  <Route path='/' component={CoreLayout}>
    <IndexRoute component={UploadFormView} />
    <Route component={HomeView} path='/todo' />
  </Route>
);

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

// export default createRoutes;
