/* eslint-env browser */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Immutable from 'immutable';
import moment from 'moment';

import configureStore from './app/store';
import App from './app/containers/App';

// Grab the state from a global variable injected into the server-generated HTML
let preloadedState = window.__PRELOADED_STATE__;
// recreate the Immutable JS objects
const reducers = Object.keys(preloadedState);
for (let reducer of reducers) {
  let dateString;
  const state = preloadedState[reducer];
  // convert date strings back into moment JS objects
  if (reducer === "calendar") {
    const eventsMap = preloadedState[reducer]["eventsMap"];
    for (let id of Object.keys(eventsMap)) {
      dateString = eventsMap[id]["date"];
      preloadedState[reducer]["eventsMap"][id]["date"] = moment(dateString);
    }
  }
  dateString = preloadedState[reducer]["activeDate"];
  preloadedState[reducer]["activeDate"] = moment(dateString);
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
