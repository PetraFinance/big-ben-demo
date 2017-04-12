/* eslint-env browser */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import moment from 'moment';
import { Provider } from 'react-redux';

import configureStore from './app/store';
import App from './app/containers/App';

// Grab the state from a global variable injected into the server-generated HTML
let preloadedState = window.__PRELOADED_STATE__;

for (const id of Object.keys(preloadedState.calendar.eventsMap)) {
  const start = preloadedState.calendar.eventsMap[id].start;
  preloadedState.calendar.eventsMap[id].start = moment(start);
  const end = preloadedState.calendar.eventsMap[id].end;
  preloadedState.calendar.eventsMap[id].end = moment(end);
}

preloadedState.calendar.selectedDate = moment(preloadedState.calendar.selectedDate);
preloadedState.calendar = Immutable.fromJS(preloadedState.calendar);

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
