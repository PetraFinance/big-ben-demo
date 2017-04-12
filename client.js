/* eslint-env browser */
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import moment from 'moment';
import { Provider } from 'react-redux';

import configureStore from './app/store';
import App from './app/containers/App';

// Create a new Redux store instance
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
