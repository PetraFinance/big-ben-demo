import Express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import configureStore from './app/store';
import App from './app/containers/App';

const app = Express();
const port = 3000;

app.use(Express.static('dist'));

function renderFullPage(html, preloadedState) {
  return `
    <!doctype html>
    <html>
      <head>
        <title>Big Ben Demo</title>
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
    `;
}

function handleRender(req, res) {
  // Create a new Redux store instance
  const store = configureStore();

  // Render the component to a string
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  // Grab the initial state from our Redux store
  const preloadedState = store.getState();

  // Send the rendered page back to the client
  res.send(renderFullPage(html, preloadedState));
}

// This is fired every time the server side receives a request
app.use(handleRender);

app.listen(port);
