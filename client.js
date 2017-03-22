/* eslint-env browser */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Immutable from 'immutable';

import configureStore from './app/store';
import App from './app/containers/App';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;
// recreate the Immutable JS objects
const reducers = Object.keys(preloadedState);
for (let reducer of reducers) {
  const state = preloadedState[reducer];
  preloadedState[reducer] = Immutable.fromJS(state);
}

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__;

// Create Redux store with initial state
const store = configureStore(preloadedState);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
