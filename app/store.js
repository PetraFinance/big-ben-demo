import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers/index';


const logger = createLogger({
  actionTransformer: action => (
    Object.assign({}, action, {
      type: String(action.type),
    })
  ),
  level: 'info',
  collapsed: false,
  logger: console,
  predicate: () => true,
});

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,
  logger,
)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(
    rootReducer,
    initialState,
  );

  return store;
}
